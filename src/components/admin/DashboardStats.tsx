import React from 'react';
import { DashboardStats as Stats } from '@/types/dashboard';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';

interface DashboardStatsProps {
  stats: Stats;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 100);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Heute */}
      <div className="bg-white rounded-xl shadow-lg p-6 transition-transform hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Heute</p>
            <p className="text-2xl font-bold text-gray-900">{stats.todayBookings}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600">Buchungen</p>
      </div>

      {/* Diese Woche */}
      <div className="bg-white rounded-xl shadow-lg p-6 transition-transform hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Diese Woche</p>
            <p className="text-2xl font-bold text-gray-900">{stats.weekBookings}</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <div className="mt-2 flex items-center">
          <span className="text-sm text-gray-600">Trend: </span>
          <span className={`ml-2 flex items-center text-sm ${stats.bookingsTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.bookingsTrend >= 0 ? (
              <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
            )}
            {formatPercentage(Math.abs(stats.bookingsTrend))}
          </span>
        </div>
      </div>

      {/* Monatlicher Umsatz */}
      <div className="bg-white rounded-xl shadow-lg p-6 transition-transform hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Monatlicher Umsatz</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="mt-2 flex items-center">
          <span className="text-sm text-gray-600">Veränderung: </span>
          <span className={`ml-2 flex items-center text-sm ${stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.revenueChange >= 0 ? (
              <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
            )}
            {formatPercentage(Math.abs(stats.revenueChange))}
          </span>
        </div>
      </div>

      {/* Auslastung */}
      <div className="bg-white rounded-xl shadow-lg p-6 transition-transform hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Auslastung</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatPercentage(Math.min((stats.weekBookings / 40) * 100, 100))}
            </p>
          </div>
          <div className="p-3 bg-pink-100 rounded-full">
            <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600">Diese Woche</p>
      </div>
    </div>
  );
};
