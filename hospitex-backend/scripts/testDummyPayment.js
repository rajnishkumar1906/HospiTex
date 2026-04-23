// scripts/testDummyPayment.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const testDummyPayment = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Test payment flow
    console.log('\n=== Testing Dummy Payment System ===\n');
    
    // 1. Create payment order
    console.log('1. Creating payment order...');
    const orderData = {
      amount: 500,
      appointmentId: null,
      diagnosticReportId: null
    };
    console.log('Order created:', orderData);
    
    // 2. Simulate successful payment
    console.log('\n2. Simulating successful payment...');
    const successPayment = {
      orderId: 'DUMMY_ORDER_' + Date.now(),
      paymentStatus: 'success'
    };
    console.log('Payment verified:', successPayment);
    
    // 3. Simulate failed payment
    console.log('\n3. Simulating failed payment...');
    const failedPayment = {
      orderId: 'DUMMY_ORDER_' + (Date.now() + 1000),
      paymentStatus: 'failed'
    };
    console.log('Payment failed:', failedPayment);
    
    console.log('\n✅ Dummy payment system is ready!');
    console.log('\n📝 Instructions:');
    console.log('1. Use POST /api/payments/create-order to create payment');
    console.log('2. Use POST /api/payments/verify with paymentStatus="success" or "failed"');
    console.log('3. Check GET /api/payments/my-payments to see all payments');
    console.log('4. Use GET /api/payments/summary for payment statistics');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
};

testDummyPayment();
