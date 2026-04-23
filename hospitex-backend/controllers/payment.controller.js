import { handleAsync } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { Payment, Appointment, DiagnosticReport } from '../models/index.js';
import { createNotification } from '../services/notification.service.js';

// Create a dummy payment order
export const createPaymentOrder = handleAsync(async (req, res) => {
  const { appointmentId, diagnosticReportId, amount } = req.body;
  
  // Generate dummy order ID
  const dummyOrderId = 'DUMMY_ORDER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  
  // Create payment record
  const payment = await Payment.create({
    user: req.userId,
    appointment: appointmentId || null,
    diagnosticReport: diagnosticReportId || null,
    amount: amount,
    currency: 'INR',
    status: 'Pending',
    paymentMethod: 'Dummy',
    transactionId: dummyOrderId,
    razorpayOrderId: dummyOrderId
  });
  
  return apiResponse.success(res, {
    orderId: dummyOrderId,
    amount: amount,
    currency: 'INR',
    paymentId: payment._id,
    key: 'dummy_key_' + Date.now()
  }, 'Dummy payment order created successfully');
});

// Verify dummy payment
export const verifyPayment = handleAsync(async (req, res) => {
  const { orderId, paymentId, paymentStatus } = req.body;
  
  // Find the payment
  const payment = await Payment.findOne({ razorpayOrderId: orderId });
  if (!payment) {
    return apiResponse.error(res, 'Payment not found', 404);
  }
  
  // Simulate payment verification
  let status = 'Failed';
  let transactionId = null;
  
  if (paymentStatus === 'success' || paymentStatus === 'Success') {
    status = 'Success';
    transactionId = 'DUMMY_TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  } else {
    status = 'Failed';
    transactionId = 'FAILED_TXN_' + Date.now();
  }
  
  // Update payment record
  payment.status = status;
  payment.transactionId = transactionId;
  payment.razorpayPaymentId = 'dummy_payment_' + Date.now();
  payment.razorpaySignature = 'dummy_signature_' + Date.now();
  await payment.save();
  
  // Create notification for user
  let notificationMessage = '';
  let notificationTitle = '';
  
  if (status === 'Success') {
    notificationTitle = 'Payment Successful';
    notificationMessage = `Your payment of ₹${payment.amount} has been successfully processed. Transaction ID: ${transactionId}`;
    
    // Update appointment or diagnostic report status if needed
    if (payment.appointment) {
      await Appointment.findByIdAndUpdate(payment.appointment, { status: 'Confirmed' });
      notificationMessage += ' Your appointment has been confirmed.';
    }
    if (payment.diagnosticReport) {
      await DiagnosticReport.findByIdAndUpdate(payment.diagnosticReport, { status: 'In Progress' });
      notificationMessage += ' Your diagnostic test has been booked.';
    }
  } else {
    notificationTitle = 'Payment Failed';
    notificationMessage = `Your payment of ₹${payment.amount} failed. Please try again.`;
  }
  
  await createNotification(
    req.userId,
    notificationTitle,
    notificationMessage,
    status === 'Success' ? 'success' : 'error',
    '/payments'
  );
  
  return apiResponse.success(res, {
    status: status,
    transactionId: transactionId,
    amount: payment.amount,
    message: status === 'Success' ? 'Payment successful!' : 'Payment failed. Please try again.'
  }, status === 'Success' ? 'Payment verified successfully' : 'Payment verification failed');
});

// Get payment status
export const getPaymentStatus = handleAsync(async (req, res) => {
  const { paymentId } = req.params;
  
  const payment = await Payment.findById(paymentId)
    .populate('appointment', 'date time doctorName')
    .populate('diagnosticReport', 'testName testDate');
  
  if (!payment) {
    return apiResponse.error(res, 'Payment not found', 404);
  }
  
  // Check if user owns this payment
  if (payment.user.toString() !== req.userId && req.userRole !== 'Admin') {
    return apiResponse.error(res, 'Unauthorized', 403);
  }
  
  return apiResponse.success(res, {
    status: payment.status,
    amount: payment.amount,
    transactionId: payment.transactionId,
    paymentMethod: payment.paymentMethod,
    createdAt: payment.createdAt,
    appointment: payment.appointment,
    diagnosticReport: payment.diagnosticReport
  }, 'Payment status retrieved');
});

// Get user's all payments
export const getUserPayments = handleAsync(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  
  const query = { user: req.userId };
  if (status) query.status = status;
  
  const payments = await Payment.find(query)
    .populate('appointment', 'date time doctorName status')
    .populate('diagnosticReport', 'testName testDate status')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  const total = await Payment.countDocuments(query);
  
  return apiResponse.paginated(res, payments, {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit)
  });
});

// Simulate payment webhook (for testing)
export const simulatePaymentWebhook = handleAsync(async (req, res) => {
  const { orderId, status } = req.body;
  
  const payment = await Payment.findOne({ razorpayOrderId: orderId });
  if (!payment) {
    return apiResponse.error(res, 'Payment not found', 404);
  }
  
  // Update payment status
  payment.status = status;
  payment.razorpayPaymentId = 'webhook_payment_' + Date.now();
  await payment.save();
  
  // Create notification
  await createNotification(
    payment.user,
    status === 'Success' ? 'Payment Updated' : 'Payment Failed',
    `Your payment of ₹${payment.amount} has been marked as ${status}`,
    status === 'Success' ? 'success' : 'error'
  );
  
  return apiResponse.success(res, { payment }, 'Webhook processed');
});

// Get payment summary for dashboard
export const getPaymentSummary = handleAsync(async (req, res) => {
  const payments = await Payment.find({ user: req.userId });
  
  const totalSpent = payments
    .filter(p => p.status === 'Success')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const pendingPayments = payments
    .filter(p => p.status === 'Pending')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const successfulPayments = payments.filter(p => p.status === 'Success').length;
  const failedPayments = payments.filter(p => p.status === 'Failed').length;
  
  return apiResponse.success(res, {
    totalSpent,
    pendingPayments,
    successfulPayments,
    failedPayments,
    totalTransactions: payments.length
  }, 'Payment summary retrieved');
});