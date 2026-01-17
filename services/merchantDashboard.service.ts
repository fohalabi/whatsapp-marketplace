import api from '@/lib/api';
import {
    ApiResponse,
    DashboardStats,
    SalesData,
    CategoryData,
    TopProduct,
    CustomerMetric,
    DeliveryZone,
    TimeFrame
} from '@/Types/merchantDashboard.types';

export const dashboardService = {
    async getMerchantDashboard(params?: {
        timeFrame?: TimeFrame;
        limit?: number;
    }): Promise<ApiResponse<DashboardStats>> {
        const response = await api.get('/merchant/dashboard', { params });
        return response.data;
    },

    async getMerchantStats(params?: {
        timeFrame?: TimeFrame;
    }): Promise<ApiResponse> {
        const response = await api.get('/merchant/dashboard/stats', { params });
        return response.data;
    },

    async getSalesTrend(params?: {
        timeFrame?: TimeFrame;
    }): Promise<ApiResponse<SalesData[]>> {
        const response = await api.get('/merchant/dashboard/sales-trend', { params });
        return response.data;
    },

    async getCategoryPerformance(): Promise<ApiResponse<CategoryData[]>> {
        const response = await api.get('/merchant/dashboard/categories');
        return response.data;
    },

    async getTopProducts(params?: {
        timeFrame?: TimeFrame;
        limit?: number;
    }): Promise<ApiResponse<TopProduct[]>> {
        const response = await api.get('/merchant/dashboard/top-products', { params });
        return response.data;
    },

    async getLowStockProducts(): Promise<ApiResponse> {
        const response = await api.get('/merchant/dashboard/low-stock');
        return response.data;
    },

    async getCustomerMetrics(params?: {
        timeFrame?: TimeFrame;
    }): Promise<ApiResponse<CustomerMetric[]>> {
        const response = await api.get('/merchant/dashboard/customer-metrics', { params });
        return response.data;
    },

    async getDeliveryZonePerformance(params?: {
        timeFrame?: TimeFrame;
    }): Promise<ApiResponse<DeliveryZone[]>> {
        const response = await api.get('/merchant/dashboard/delivery-zones', { params });
        return response.data;
    },

    async healthCheck(): Promise<ApiResponse> {
        const response = await api.get('/merchant/dashboard/health');
        return response.data;
    },
};