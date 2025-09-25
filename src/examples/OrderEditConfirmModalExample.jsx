import React, { useState } from 'react';
import OrderEditConfirmModal from '../components/OrderEditConfirmModal';

// Example usage component
const OrderEditConfirmModalExample = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Sample data - replace with your actual data
  const sampleOrder = {
    id: 123,
    status: 'placed',
    items: [
      {
        id: 1,
        product_id: 101,
        original_qty: 2,
        final_qty: 2,
        unit_price: 150.00,
        subtotal: 300.00,
      },
      {
        id: 2,
        product_id: 102,
        original_qty: 1,
        final_qty: 1,
        unit_price: 250.00,
        subtotal: 250.00,
      }
    ],
    total_amount: 550.00,
    created_at: '2025-01-15T10:30:00Z',
    vendor_id: 1,
    customer_id: 2,
  };

  const sampleProducts = [
    {
      id: 101,
      name: 'Premium Headphones',
      sku: 'HP001',
      price: 150.00,
      stocklevel_quantity: 25,
      weight: 0.5, // kg
      image: '/images/headphones.jpg',
      batches: [
        {
          id: 1,
          batch_no: 'B001',
          quantity: 15,
          expire_date: '2025-12-31',
          added_at: '2025-01-01',
        },
        {
          id: 2,
          batch_no: 'B002',
          quantity: 10,
          expire_date: '2026-06-30',
          added_at: '2025-01-10',
        }
      ]
    },
    {
      id: 102,
      name: 'Wireless Mouse',
      sku: 'WM002',
      price: 250.00,
      stocklevel_quantity: 50,
      weight: 0.3, // kg
      image: '/images/mouse.jpg',
      batches: [
        {
          id: 3,
          batch_no: 'M001',
          quantity: 50,
          expire_date: '2026-12-31',
          added_at: '2025-01-05',
        }
      ]
    },
    {
      id: 103,
      name: 'USB Cable',
      sku: 'UC003',
      price: 50.00,
      stocklevel_quantity: 100,
      weight: 0.1, // kg
      batches: []
    },
    {
      id: 104,
      name: 'Laptop Stand',
      sku: 'LS004',
      price: 500.00,
      stocklevel_quantity: 8,
      weight: 2.0, // kg
      batches: [
        {
          id: 4,
          batch_no: 'LS001',
          quantity: 8,
          expire_date: '2027-01-31',
          added_at: '2025-01-12',
        }
      ]
    }
  ];

  const sampleVehicles = [
    {
      id: 4,
      vehicle_number: 'JH05AD 3268',
      driver_mobile: '8709790175',
      lat: 85.66,
      lng: 87.36,
      capacity_weight: 150,
      capacity_unit: 'kg',
      details: 'Delivery truck - Zone A',
      driver_id: 1,
      active: true,
      created_at: '2025-09-22T10:55:41',
      updated_at: '2025-09-23T06:38:47'
    },
    {
      id: 5,
      vehicle_number: 'Jh05BC7896',
      driver_mobile: '9955127024',
      lat: 83.66,
      lng: 89.35,
      capacity_weight: 200,
      capacity_unit: 'kg',
      details: 'Heavy duty truck - Zone B',
      driver_id: 1,
      active: true,
      created_at: '2025-09-23T09:30:57',
      updated_at: null
    },
    {
      id: 6,
      vehicle_number: 'JH01XY9999',
      driver_mobile: '9876543210',
      lat: 82.15,
      lng: 88.20,
      capacity_weight: 50,
      capacity_unit: 'kg',
      details: 'Small delivery van - Zone C',
      driver_id: 2,
      active: true,
      created_at: '2025-09-20T08:15:30',
      updated_at: '2025-09-22T14:20:15'
    }
  ];

  const handleOpenModal = () => {
    setCurrentOrder(sampleOrder);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentOrder(null);
  };

  const handleOrderUpdated = (updatedOrder) => {
    console.log('Order updated:', updatedOrder);
    setCurrentOrder(updatedOrder);
    
    // Here you would typically:
    // 1. Update your local state
    // 2. Refresh your orders list
    // 3. Show a success message
    // 4. Optionally close the modal (based on autoCloseOnConfirm prop)
    
    // Example: Show success toast
    alert(`Order ${updatedOrder.id} has been updated successfully!`);
  };

  const handleError = (error) => {
    console.error('Modal error:', error);
    // Here you would typically show an error toast/notification
    alert(`Error: ${error.message}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          OrderEditConfirmModal Example
        </h1>
        
        {/* Demo Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Sample Order #{sampleOrder.id}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Order Details</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Status: <span className="font-medium">{sampleOrder.status}</span></li>
                <li>Items: <span className="font-medium">{sampleOrder.items.length}</span></li>
                <li>Total: <span className="font-medium">₹{sampleOrder.total_amount}</span></li>
                <li>Created: <span className="font-medium">{new Date(sampleOrder.created_at).toLocaleDateString()}</span></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Available Resources</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Products: <span className="font-medium">{sampleProducts.length}</span></li>
                <li>Vehicles: <span className="font-medium">{sampleVehicles.length}</span></li>
                <li>Total Capacity: <span className="font-medium">400kg</span></li>
              </ul>
            </div>
          </div>
          
          <button
            onClick={handleOpenModal}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Open Edit & Confirm Modal
          </button>
        </div>
        
        {/* Features List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Modal Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Edit Functionality</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✅ Product search and batch details</li>
                <li>✅ Add/remove order items</li>
                <li>✅ Quantity and price editing</li>
                <li>✅ Stock validation</li>
                <li>✅ Real-time total calculation</li>
                <li>✅ Inline error handling</li>
                <li>✅ Quick product addition from batches</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Confirm Functionality</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✅ Vehicle capacity validation</li>
                <li>✅ Weight calculation</li>
                <li>✅ Visual capacity indicators</li>
                <li>✅ Driver contact information</li>
                <li>✅ Delivery notes</li>
                <li>✅ Order status updates</li>
                <li>✅ GPS coordinates display</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-medium text-gray-700 mb-3">Technical Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <ul className="space-y-1">
                <li>✅ Responsive design</li>
                <li>✅ Mobile tabs</li>
                <li>✅ Keyboard navigation</li>
                <li>✅ Focus management</li>
              </ul>
              <ul className="space-y-1">
                <li>✅ API integration</li>
                <li>✅ Loading states</li>
                <li>✅ Error handling</li>
                <li>✅ Optimistic updates</li>
              </ul>
              <ul className="space-y-1">
                <li>✅ Accessibility (ARIA)</li>
                <li>✅ ESC key support</li>
                <li>✅ Click outside to close</li>
                <li>✅ Configurable props</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Code Example */}
        <div className="mt-8 bg-gray-900 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Usage Example</h3>
          <pre className="text-sm overflow-x-auto">
            <code>{`import OrderEditConfirmModal from './components/OrderEditConfirmModal';

// In your component
const [modalOpen, setModalOpen] = useState(false);

const handleOrderUpdated = (updatedOrder) => {
  console.log('Order updated:', updatedOrder);
  // Update your state, show success message, etc.
};

const handleError = (error) => {
  console.error('Error:', error);
  // Show error message to user
};

// Render the modal
{modalOpen && (
  <OrderEditConfirmModal
    order={currentOrder}
    products={products}
    vehicles={vehicles}
    token={authToken}
    onClose={() => setModalOpen(false)}
    onUpdated={handleOrderUpdated}
    onError={handleError}
    apiBase="/api"
    autoCloseOnConfirm={true}
    readOnlyPrice={true}
  />
)}`}</code>
          </pre>
        </div>
      </div>
      
      {/* Render Modal */}
      {modalOpen && (
        <OrderEditConfirmModal
          order={currentOrder}
          products={sampleProducts}
          vehicles={sampleVehicles}
          token="sample-auth-token" // Replace with actual token
          onClose={handleCloseModal}
          onUpdated={handleOrderUpdated}
          onError={handleError}
          apiBase="/api" // Replace with your API base URL
          autoCloseOnConfirm={true}
          readOnlyPrice={true}
        />
      )}
    </div>
  );
};

export default OrderEditConfirmModalExample;