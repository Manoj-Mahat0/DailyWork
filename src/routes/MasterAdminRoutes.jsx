import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MasterOrdersMovementDetails from '../pages/MasterAdmin/MasterOrdersMovementDetails';
import EditOrderItems from '../pages/MasterAdmin/EditOrderItems';

export default function MasterAdminRoutes() {
    return (
        <Routes>
            <Route path="/orders/:id" element={<MasterOrdersMovementDetails />} />
            <Route path="/orders/:id/edit-items" element={<EditOrderItems />} />
        </Routes>
    );
}