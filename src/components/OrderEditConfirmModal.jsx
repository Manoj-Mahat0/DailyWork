import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  FiX,
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiTruck,
  FiPackage,
  FiShoppingCart,
  FiSearch,
  FiEye,
  FiEyeOff,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiInfo,
  FiUser,
  FiCheck,
  FiAlertTriangle,
} from 'react-icons/fi';

// Helper functions
export const calculateTotals = (items) => {
  if (!Array.isArray(items)) return { qty: 0, subtotal: 0 };
  return items.reduce(
    (acc, item) => {
      const qty = Number(item.qty || 0);
      const price = Number(item.unit_price || 0);
      return {
        qty: acc.qty + qty,
        subtotal: acc.subtotal + (qty * price),
      };
    },
    { qty: 0, subtotal: 0 }
  );
};

export const calculateOrderWeight = (items, products) => {
  if (!Array.isArray(items) || !Array.isArray(products)) return 0;
  const productMap = products.reduce((map, p) => {
    map[p.id] = p;
    return map;
  }, {});
  
  return items.reduce((total, item) => {
    const product = productMap[item.product_id];
    const qty = Number(item.qty || 0);
    const weight = product?.weight || 1; // Default 1kg per item
    return total + (qty * weight);
  }, 0);
};

const formatCurrency = (amount) => {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));
  } catch {
    return `₹${Number(amount || 0).toFixed(2)}`;
  }
};

const formatDate = (date) => {
  if (!date) return '-';
  try {
    return new Date(date).toLocaleString('en-IN');
  } catch {
    return date;
  }
};

// Helper Components
const StatusBadge = ({ status }) => {
  const statusConfig = {
    placed: { bg: 'bg-gradient-to-r from-indigo-500 to-purple-600', text: 'text-white' },
    confirmed: { bg: 'bg-gradient-to-r from-blue-500 to-cyan-600', text: 'text-white' },
    processing: { bg: 'bg-gradient-to-r from-yellow-500 to-orange-500', text: 'text-white' },
    shipped: { bg: 'bg-gradient-to-r from-orange-500 to-red-500', text: 'text-white' },
    received: { bg: 'bg-gradient-to-r from-green-500 to-emerald-600', text: 'text-white' },
    cancelled: { bg: 'bg-gradient-to-r from-red-500 to-pink-600', text: 'text-white' },
    returned: { bg: 'bg-gradient-to-r from-red-600 to-rose-700', text: 'text-white' },
  };
  
  const config = statusConfig[String(status || '').toLowerCase()] || 
    { bg: 'bg-gray-100', text: 'text-gray-700' };
  
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-full ${config.bg} ${config.text} shadow-sm`}>
      <span className="w-2 h-2 rounded-full bg-white/80 animate-pulse" />
      {String(status || '').toUpperCase()}
    </span>
  );
};

const StockIndicator = ({ stock, size = 'sm' }) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };
  
  let colorClass = 'bg-red-500';
  if (stock > 50) colorClass = 'bg-green-500';
  else if (stock > 20) colorClass = 'bg-yellow-500';
  else if (stock > 0) colorClass = 'bg-orange-500';
  
  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses[size]} ${colorClass} rounded-full shadow-sm`} />
      <span className="text-sm font-medium text-gray-700">{stock}</span>
    </div>
  );
};

const CustomProductSelect = ({ 
  products, 
  value, 
  onChange, 
  placeholder = '— Select Product —',
  error 
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
  
  const selected = products.find(p => String(p.id) === String(value)) || null;
  
  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full text-left px-4 py-3 border rounded-xl bg-white hover:bg-gray-50 flex items-center justify-between gap-3 transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-300' : 'border-gray-200'
        }`}
      >
        <div className="min-w-0 truncate">
          {selected ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold text-xs">
                {selected.name?.charAt(0) || 'P'}
              </div>
              <div>
                <div className="font-medium text-gray-900 truncate">{selected.name}</div>
                <div className="text-xs text-gray-500">
                  {selected.sku ? `SKU: ${selected.sku}` : `ID: ${selected.id}`}
                  {selected.price && ` • ${formatCurrency(selected.price)}`}
                </div>
              </div>
            </div>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <div className="text-gray-400">
          <svg className={`w-5 h-5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      
      {open && (
        <div className="absolute z-20 mt-2 w-full max-h-64 overflow-auto rounded-xl border border-gray-200 bg-white shadow-xl">
          {products.map(product => (
            <div
              key={product.id}
              onClick={() => {
                onChange(String(product.id));
                setOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                {product.name?.charAt(0) || 'P'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">{product.name}</div>
                <div className="text-sm text-gray-500 truncate">
                  {product.sku ? `SKU: ${product.sku}` : `ID: ${product.id}`}
                  {product.price && ` • ${formatCurrency(product.price)}`}
                </div>
              </div>
              <StockIndicator stock={product.stocklevel_quantity || 0} />
            </div>
          ))}
        </div>
      )}
      
      {error && (
        <div className="text-xs text-red-600 mt-1">{error}</div>
      )}
    </div>
  );
};

// Main Modal Component
const OrderEditConfirmModal = ({
  order,
  products = [],
  vehicles = [],
  token,
  onClose,
  onUpdated,
  onError,
  apiBase = '/api',
  autoCloseOnConfirm = true,
  readOnlyPrice = true,
}) => {
  // State management
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'confirm'
  const [editRows, setEditRows] = useState([]);
  const [editReason, setEditReason] = useState('');
  const [editErrors, setEditErrors] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [confirmNotes, setConfirmNotes] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);
  
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [productSearch, setProductSearch] = useState('');
  const [batchesMap, setBatchesMap] = useState({});
  
  const modalRef = useRef(null);
  
  // Initialize edit rows from order
  useEffect(() => {
    if (order?.items) {
      const rows = order.items.map(item => ({
        id: item.id,
        product_id: item.product_id,
        qty: Number(item.final_qty || item.original_qty || 0),
        unit_price: Number(item.unit_price || 0),
        tempId: `existing-${item.id}`,
      }));
      setEditRows(rows);
    }
  }, [order]);
  
  // API helper
  const apiRequest = async (path, options = {}) => {
    const headers = { 'Accept': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const fetchOptions = {
      method: options.method || 'GET',
      headers,
    };
    
    if (options.body) {
      headers['Content-Type'] = 'application/json';
      fetchOptions.body = JSON.stringify(options.body);
    }
    
    try {
      const response = await fetch(`${apiBase}${path}`, fetchOptions);
      const text = await response.text();
      let data = null;
      
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }
      
      if (!response.ok) {
        const message = data?.detail || data?.message || data?.error || 
          (typeof data === 'string' ? data : `Request failed: ${response.status}`);
        throw new Error(message);
      }
      
      return data;
    } catch (error) {
      if (onError) onError(error);
      throw error;
    }
  };
  
  // Fetch batches for a product
  const fetchBatches = async (productId) => {
    if (batchesMap[productId]) return;
    try {
      const data = await apiRequest(`/products-with-stock/stock/batches/${productId}`);
      setBatchesMap(prev => ({
        ...prev,
        [productId]: Array.isArray(data) ? data : [data],
      }));
    } catch (error) {
      console.error('Failed to fetch batches:', error);
      setBatchesMap(prev => ({ ...prev, [productId]: [] }));
    }
  };
  
  // Calculations
  const totals = useMemo(() => calculateTotals(editRows), [editRows]);
  const orderWeight = useMemo(() => calculateOrderWeight(editRows, products), [editRows, products]);
  
  // Product map for quick lookup
  const productMap = useMemo(() => {
    return products.reduce((map, product) => {
      map[product.id] = product;
      return map;
    }, {});
  }, [products]);
  
  // Filtered products for search
  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return products;
    const search = productSearch.toLowerCase();
    return products.filter(product =>
      product.name?.toLowerCase().includes(search) ||
      product.sku?.toLowerCase().includes(search) ||
      String(product.id).includes(search)
    );
  }, [products, productSearch]);
  
  // Edit functions
  const addEmptyRow = () => {
    setEditRows(prev => [...prev, {
      tempId: `new-${Date.now()}-${Math.random()}`,
      product_id: '',
      qty: 1,
      unit_price: 0,
    }]);
  };
  
  const updateRow = (index, updates) => {
    setEditRows(prev => {
      const newRows = [...prev];
      newRows[index] = { ...newRows[index], ...updates };
      return newRows;
    });
  };
  
  const removeRow = (index) => {
    setEditRows(prev => {
      const newRows = [...prev];
      newRows.splice(index, 1);
      return newRows;
    });
  };
  
  const addProductToEdit = (product) => {
    const existingIndex = editRows.findIndex(row => row.product_id === String(product.id));
    if (existingIndex >= 0) {
      // Update existing row quantity
      updateRow(existingIndex, {
        qty: editRows[existingIndex].qty + 1,
      });
    } else {
      // Add new row
      setEditRows(prev => [...prev, {
        tempId: `added-${Date.now()}-${Math.random()}`,
        product_id: String(product.id),
        qty: 1,
        unit_price: product.price || 0,
      }]);
    }
    
    // Switch to edit tab on narrow screens
    if (window.innerWidth < 1024) {
      setActiveTab('edit');
    }
  };
  
  // Validation
  const validateEdit = () => {
    const errors = {};
    
    if (editRows.length === 0) {
      errors.global = 'At least one item is required';
    }
    
    editRows.forEach((row, index) => {
      if (!row.product_id) {
        errors[`product_${index}`] = 'Product is required';
      }
      
      const qty = Number(row.qty);
      if (!qty || qty <= 0) {
        errors[`qty_${index}`] = 'Quantity must be greater than 0';
      }
      
      const product = productMap[row.product_id];
      if (product && product.stocklevel_quantity != null && qty > product.stocklevel_quantity) {
        errors[`qty_${index}`] = `Exceeds available stock (${product.stocklevel_quantity})`;
      }
      
      if (!readOnlyPrice) {
        const price = Number(row.unit_price);
        if (price < 0) {
          errors[`price_${index}`] = 'Price cannot be negative';
        }
      }
    });
    
    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Submit edit
  const submitEdit = async () => {
    if (!validateEdit()) return;
    
    setEditLoading(true);
    try {
      const items = editRows.map(row => ({
        product_id: Number(row.product_id),
        qty: Number(row.qty),
        unit_price: Number(row.unit_price),
      }));
      
      const payload = {
        items,
        reason: editReason || 'Order items updated',
      };
      
      const result = await apiRequest(`/orders/${order.id}/items`, {
        method: 'PATCH',
        body: payload,
      });
      
      // Fetch updated order
      const updatedOrder = await apiRequest(`/orders/${order.id}`);
      
      if (onUpdated) onUpdated(updatedOrder);
      
      // Show success message (you might want to add a toast system)
      console.log('Order updated successfully');
      
    } catch (error) {
      console.error('Failed to update order:', error);
    } finally {
      setEditLoading(false);
    }
  };
  
  // Submit confirm
  const submitConfirm = async () => {
    if (!selectedVehicle) return;
    
    setConfirmLoading(true);
    try {
      const payload = {
        vehicle_id: selectedVehicle.id,
        notes: confirmNotes || 'Order confirmed',
      };
      
      const result = await apiRequest(`/orders/${order.id}/confirm`, {
        method: 'POST',
        body: payload,
      });
      
      // Update order with new status
      const updatedOrder = {
        ...order,
        status: result.status || 'confirmed',
        vehicle_id: result.vehicle_id,
      };
      
      if (onUpdated) onUpdated(updatedOrder);
      
      if (autoCloseOnConfirm) {
        onClose();
      }
      
    } catch (error) {
      console.error('Failed to confirm order:', error);
    } finally {
      setConfirmLoading(false);
    }
  };
  
  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  
  // Focus trap
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);
  
  if (!order) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative bg-white w-full max-w-7xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h2 id="modal-title" className="text-xl font-semibold">
                Edit & Confirm Order #{order.id}
              </h2>
              <div className="flex items-center gap-4 mt-2">
                <StatusBadge status={order.status} />
                <span className="text-blue-100">
                  Weight: {orderWeight}kg • Total: {formatCurrency(totals.subtotal)}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 text-white transition-colors duration-200"
              aria-label="Close modal"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
          
          {/* Mobile tabs */}
          <div className="lg:hidden mt-4 flex bg-white/10 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${
                activeTab === 'edit' 
                  ? 'bg-white text-blue-600' 
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <FiEdit2 className="w-4 h-4 inline mr-2" />
              Edit Items
            </button>
            <button
              onClick={() => setActiveTab('confirm')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${
                activeTab === 'confirm' 
                  ? 'bg-white text-blue-600' 
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <FiTruck className="w-4 h-4 inline mr-2" />
              Confirm Order
            </button>
          </div>
        </div>
        
        {/* Body */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full lg:grid lg:grid-cols-12 lg:divide-x lg:divide-gray-200">
            
            {/* Products Panel - Left */}
            <div className={`lg:col-span-3 bg-gray-50 overflow-y-auto ${
              activeTab === 'edit' ? 'block' : 'hidden lg:block'
            }`}>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <FiPackage className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Product Batches</h3>
                </div>
                
                {/* Search */}
                <div className="relative mb-4">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {/* Products List */}
                <div className="space-y-3">
                  {filteredProducts.map(product => {
                    const isExpanded = expandedProduct === product.id;
                    const batches = batchesMap[product.id] || null;
                    
                    return (
                      <div key={product.id} className="bg-white rounded-lg border border-gray-200 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div 
                            className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                            onClick={() => addProductToEdit(product)}
                          >
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold text-xs">
                              {product.name?.charAt(0) || 'P'}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-gray-900 truncate text-sm">
                                {product.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {product.sku ? `SKU: ${product.sku}` : `ID: ${product.id}`}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <StockIndicator stock={product.stocklevel_quantity || 0} />
                            <button
                              onClick={async () => {
                                if (isExpanded) {
                                  setExpandedProduct(null);
                                } else {
                                  setExpandedProduct(product.id);
                                  await fetchBatches(product.id);
                                }
                              }}
                              className="text-xs px-2 py-1 border border-gray-200 rounded hover:bg-gray-50"
                            >
                              {isExpanded ? <FiEyeOff className="w-3 h-3" /> : <FiEye className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                        
                        {isExpanded && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            {batches === null ? (
                              <div className="text-xs text-gray-500 text-center py-2">Loading...</div>
                            ) : batches.length === 0 ? (
                              <div className="text-xs text-gray-500 text-center py-2">No batches</div>
                            ) : (
                              <div className="space-y-2">
                                {batches.map((batch, idx) => (
                                  <div key={batch.id || idx} className="text-xs bg-gray-50 rounded p-2">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="font-medium">
                                        {batch.batch_no || 'N/A'}
                                      </span>
                                      <span className="text-blue-600 font-semibold">
                                        Qty: {batch.quantity || 0}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                      <span>Exp: {formatDate(batch.expire_date)}</span>
                                      <span>Added: {formatDate(batch.added_at)}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Edit Panel - Middle */}
            <div className={`lg:col-span-5 overflow-y-auto ${
              activeTab === 'edit' ? 'block' : 'hidden lg:block'
            }`}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FiEdit2 className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Edit Order Items</h3>
                  </div>
                  <button
                    onClick={addEmptyRow}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <FiPlus className="w-4 h-4" />
                    Add Item
                  </button>
                </div>
                
                {editErrors.global && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {editErrors.global}
                  </div>
                )}
                
                {/* Edit Rows */}
                <div className="space-y-3 mb-4">
                  {editRows.map((row, index) => {
                    const product = productMap[row.product_id];
                    const productError = editErrors[`product_${index}`];
                    const qtyError = editErrors[`qty_${index}`];
                    const priceError = editErrors[`price_${index}`];
                    
                    return (
                      <div key={row.tempId || row.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-12 gap-3 items-start">
                          {/* Product Select */}
                          <div className="col-span-12 md:col-span-6">
                            <CustomProductSelect
                              products={products}
                              value={row.product_id}
                              onChange={(productId) => {
                                const selectedProduct = productMap[productId];
                                updateRow(index, {
                                  product_id: productId,
                                  unit_price: selectedProduct?.price || 0,
                                });
                              }}
                              error={productError}
                            />
                          </div>
                          
                          {/* Quantity */}
                          <div className="col-span-6 md:col-span-2">
                            <input
                              type="number"
                              min="1"
                              value={row.qty}
                              onChange={(e) => updateRow(index, { qty: Number(e.target.value) || 0 })}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                qtyError ? 'border-red-300' : 'border-gray-200'
                              }`}
                              placeholder="Qty"
                            />
                            {qtyError && <div className="text-xs text-red-600 mt-1">{qtyError}</div>}
                          </div>
                          
                          {/* Unit Price */}
                          <div className="col-span-6 md:col-span-2">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={row.unit_price}
                              onChange={(e) => updateRow(index, { unit_price: Number(e.target.value) || 0 })}
                              readOnly={readOnlyPrice}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                                readOnlyPrice ? 'bg-gray-50 cursor-not-allowed' : ''
                              } ${priceError ? 'border-red-300' : 'border-gray-200'}`}
                              placeholder="Price"
                            />
                            {priceError && <div className="text-xs text-red-600 mt-1">{priceError}</div>}
                          </div>
                          
                          {/* Subtotal & Remove */}
                          <div className="col-span-12 md:col-span-2 flex items-center justify-between">
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(row.qty * row.unit_price)}
                            </span>
                            <button
                              onClick={() => removeRow(index)}
                              className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors duration-200"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Reason */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Changes
                  </label>
                  <input
                    type="text"
                    value={editReason}
                    onChange={(e) => setEditReason(e.target.value)}
                    placeholder="Enter reason for editing..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* Edit Summary & Actions */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <span>Items: <strong>{editRows.length}</strong></span>
                        <span>Total Qty: <strong>{totals.qty}</strong></span>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(totals.subtotal)}
                    </div>
                  </div>
                  
                  <button
                    onClick={submitEdit}
                    disabled={editLoading || editRows.length === 0}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all duration-200 ${
                      editLoading || editRows.length === 0
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {editLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <FiCheck className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Confirm Panel - Right */}
            <div className={`lg:col-span-4 bg-gray-50 overflow-y-auto ${
              activeTab === 'confirm' ? 'block' : 'hidden lg:block'
            }`}>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <FiTruck className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-semibold text-gray-900">Confirm Order</h3>
                </div>
                
                {/* Order Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <FiInfo className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Order Requirements</span>
                  </div>
                  <div className="text-sm text-blue-700">
                    Weight: <strong>{orderWeight}kg</strong> • 
                    Items: <strong>{totals.qty}</strong> • 
                    Value: <strong>{formatCurrency(totals.subtotal)}</strong>
                  </div>
                </div>
                
                {/* Vehicle Selection */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Select Vehicle</h4>
                  
                  {vehicles.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FiTruck className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p>No vehicles available</p>
                    </div>
                  ) : (
                    vehicles.map(vehicle => {
                      const isSelected = selectedVehicle?.id === vehicle.id;
                      const hasCapacity = vehicle.capacity_weight >= orderWeight;
                      const usagePercent = Math.min((orderWeight / vehicle.capacity_weight) * 100, 100);
                      
                      return (
                        <div
                          key={vehicle.id}
                          onClick={() => hasCapacity && setSelectedVehicle(vehicle)}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? 'border-green-500 bg-green-50'
                              : hasCapacity
                                ? 'border-gray-200 hover:border-green-300 bg-white'
                                : 'border-red-200 bg-red-50 cursor-not-allowed opacity-60'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                isSelected ? 'bg-green-500' : hasCapacity ? 'bg-blue-500' : 'bg-red-500'
                              }`}>
                                <FiTruck className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-900">
                                  {vehicle.vehicle_number}
                                </h5>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <div className="flex items-center gap-1">
                                    <FiPhone className="w-3 h-3" />
                                    {vehicle.driver_mobile}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <FiMapPin className="w-3 h-3" />
                                    {vehicle.lat}, {vehicle.lng}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className={`font-bold ${hasCapacity ? 'text-green-600' : 'text-red-600'}`}>
                                {vehicle.capacity_weight} {vehicle.capacity_unit}
                              </div>
                              <div className="text-xs text-gray-500 mb-2">Capacity</div>
                              
                              {/* Usage bar */}
                              <div className="w-20">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                  <span>Usage</span>
                                  <span>{Math.round(usagePercent)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                      usagePercent > 100 ? 'bg-red-500' :
                                      usagePercent > 80 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                    style={{ width: `${Math.min(usagePercent, 100)}%` }}
                                  />
                                </div>
                              </div>
                              
                              {!hasCapacity && (
                                <div className="text-xs text-red-600 mt-1 font-medium">
                                  Insufficient capacity
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {vehicle.details && (
                            <div className="text-sm text-gray-500 mb-2">{vehicle.details}</div>
                          )}
                          
                          {isSelected && (
                            <div className="pt-3 border-t border-green-200">
                              <div className="flex items-center gap-2 text-green-700">
                                <FiCheck className="w-4 h-4" />
                                <span className="font-medium">Selected for delivery</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
                
                {/* Notes */}
                {selectedVehicle && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Notes (Optional)
                    </label>
                    <textarea
                      value={confirmNotes}
                      onChange={(e) => setConfirmNotes(e.target.value)}
                      placeholder="Add delivery instructions..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                    />
                  </div>
                )}
                
                {/* Confirm Button */}
                <div className="mt-6">
                  <button
                    onClick={submitConfirm}
                    disabled={!selectedVehicle || confirmLoading}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all duration-200 ${
                      !selectedVehicle || confirmLoading
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {confirmLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Confirming Order...
                      </>
                    ) : (
                      <>
                        <FiCheck className="w-4 h-4" />
                        Confirm Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderEditConfirmModal;