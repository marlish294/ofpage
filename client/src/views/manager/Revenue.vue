<template>
  <div class="revenue-view container-fluid py-4">
    <div class="container">
      <div class="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h2 class="page-title">
            <i class="fas fa-chart-line me-2 text-primary"></i>
            Revenue & Subscribers
          </h2>
          <p class="page-subtitle text-muted mb-0">
            Live breakdown of your model’s earnings and subscriber activity
          </p>
        </div>
        <div class="d-flex flex-wrap align-items-center gap-3">
          <div class="d-flex flex-column">
            <label class="form-label mb-1">Reporting Year</label>
            <select
              class="form-select"
              v-model.number="summary.year"
              :disabled="loading.summary"
            >
              <option
                v-for="yearOption in summary.availableYears"
                :key="`year-${yearOption}`"
                :value="yearOption"
              >
                {{ yearOption }}
              </option>
            </select>
          </div>
          <div class="live-indicator badge d-flex align-items-center gap-2 px-3 py-2">
            <span
              class="status-dot"
              :class="socketConnected ? 'bg-success' : 'bg-secondary'"
            ></span>
            <span>{{ socketConnected ? 'Live updates on' : 'Live updates off' }}</span>
          </div>
          <button
            class="btn btn-outline-primary d-flex align-items-center"
            type="button"
            @click="refreshData"
            :disabled="isRefreshing"
          >
            <span v-if="isRefreshing" class="spinner-border spinner-border-sm me-2" role="status"></span>
            <i v-else class="fas fa-sync-alt me-2"></i>
            Refresh
          </button>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-body">
          <div v-if="loading.summary" class="text-center py-5">
            <span class="spinner-border text-primary" role="status"></span>
            <p class="text-muted mt-3 mb-0">Loading revenue summary...</p>
          </div>
          <template v-else>
            <div class="summary-grid">
              <div
                v-for="month in summary.months"
                :key="`month-${month.month}`"
                class="summary-card"
              >
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <div class="summary-month">{{ month.label }}</div>
                    <div class="summary-year text-muted">{{ summary.year }}</div>
                  </div>
                  <div class="summary-total">${{ formatCurrency(month.total) }}</div>
                </div>
                <div class="summary-breakdown text-muted mb-3">
                  <span>
                    <i class="fas fa-receipt me-1 text-primary"></i>
                    ${{ formatCurrency(month.subscriptionTotal) }} subs
                  </span>
                  <span>
                    <i class="fas fa-unlock me-1 text-warning"></i>
                    ${{ formatCurrency(month.unlockTotal) }} unlocks
                  </span>
                </div>
                <div class="summary-growth" :class="growthClass(month.growth)">
                  <template v-if="month.growth === null">
                    <i class="fas fa-minus me-1"></i>
                    No prior data
                  </template>
                  <template v-else>
                    <i class="fas me-1" :class="month.growth >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'"></i>
                    {{ formatGrowth(month.growth) }}
                  </template>
                </div>
              </div>
            </div>

            <div class="summary-totals mt-4">
              <div class="total-card shadow-sm">
                <div class="label text-muted">Year-to-date Revenue</div>
                <div class="value text-primary">${{ formatCurrency(summary.totals.totalRevenue) }}</div>
              </div>
              <div class="total-card shadow-sm">
                <div class="label text-muted">Subscriptions</div>
                <div class="value text-success">${{ formatCurrency(summary.totals.subscriptionRevenue) }}</div>
              </div>
              <div class="total-card shadow-sm">
                <div class="label text-muted">Media Unlocks</div>
                <div class="value text-warning">${{ formatCurrency(summary.totals.unlockRevenue) }}</div>
              </div>
              <div class="total-card shadow-sm">
                <div class="label text-muted">Active Subscribers</div>
                <div class="value text-info">{{ summary.subscriberCount }}</div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="filters row g-3 align-items-end">
            <div class="col-sm-6 col-md-4 col-lg-3">
              <label class="form-label">Type</label>
              <select
                class="form-select"
                v-model="filters.type"
                :disabled="loading.entries"
              >
                <option value="all">All revenue</option>
                <option value="subscription">Subscriptions</option>
                <option value="unlock">Media unlocks</option>
              </select>
            </div>
            <div class="col-sm-6 col-md-4 col-lg-3">
              <label class="form-label">Month</label>
              <input
                type="month"
                class="form-control"
                v-model="selectedMonth"
                :max="maxMonthFilter"
                :disabled="loading.entries"
              />
            </div>
            <div class="col-sm-6 col-md-4 col-lg-3">
              <label class="form-label">Start date</label>
              <input
                type="date"
                class="form-control"
                v-model="filters.startDate"
                :disabled="loading.entries"
              />
            </div>
            <div class="col-sm-6 col-md-4 col-lg-3">
              <label class="form-label">End date</label>
              <input
                type="date"
                class="form-control"
                v-model="filters.endDate"
                :disabled="loading.entries"
              />
            </div>
            <div class="col-sm-6 col-md-4 col-lg-3">
              <label class="form-label">Sort</label>
              <div class="d-flex gap-2">
                <select
                  class="form-select"
                  v-model="filters.sortBy"
                  :disabled="loading.entries"
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                </select>
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  @click="toggleSortOrder"
                  :disabled="loading.entries"
                >
                  <i
                    class="fas"
                    :class="filters.sortOrder === 'desc' ? 'fa-sort-amount-down-alt' : 'fa-sort-amount-up'"
                  ></i>
                </button>
              </div>
            </div>
            <div class="col-sm-6 col-md-4 col-lg-3">
              <label class="form-label">Search</label>
              <input
                type="text"
                class="form-control"
                placeholder="Search subscriber"
                v-model="filters.search"
                :disabled="loading.entries"
              />
            </div>
            <div class="col-sm-6 col-md-4 col-lg-3 d-flex align-items-end">
              <button
                class="btn btn-outline-secondary w-100"
                type="button"
                @click="clearFilters"
                :disabled="loading.entries || !hasActiveFilters"
              >
                <i class="fas fa-broom me-2"></i>
                Clear Filters
              </button>
            </div>
          </div>

          <div class="table-responsive mt-4">
            <table class="table align-middle mb-0">
              <thead>
                <tr class="text-muted">
                  <th scope="col">Date</th>
                  <th scope="col">Subscriber</th>
                  <th scope="col">Type</th>
                  <th scope="col" class="text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loading.entries">
                  <td colspan="4" class="text-center py-4">
                    <span class="spinner-border spinner-border-sm text-primary me-2" role="status"></span>
                    Loading revenue entries...
                  </td>
                </tr>
                <tr v-else-if="entries.length === 0">
                  <td colspan="4" class="text-center text-muted py-4">
                    <i class="fas fa-search mb-2"></i>
                    <div>No revenue records found for the current filters.</div>
                  </td>
                </tr>
                <tr v-for="entry in entries" :key="`${entry.type}-${entry.id}`">
                  <td>{{ formatDate(entry.date) }}</td>
                  <td>{{ entry.userName || 'Unknown subscriber' }}</td>
                  <td>
                    <span
                      class="badge rounded-pill"
                      :class="entry.type === 'subscription' ? 'bg-primary-subtle text-primary' : 'bg-warning-subtle text-warning'"
                    >
                      <i
                        class="fas me-1"
                        :class="entry.type === 'subscription' ? 'fa-receipt' : 'fa-unlock'"
                      ></i>
                      {{ entry.type === 'subscription' ? 'Subscription' : 'Media unlock' }}
                    </span>
                  </td>
                  <td class="text-end fw-semibold">
                    ${{ formatCurrency(entry.amount) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="filtered-totals mt-4">
            <div class="totals-header text-muted text-uppercase mb-2">
              Filtered Totals
            </div>
            <div class="totals-grid">
              <div class="filtered-total-card shadow-sm">
                <div class="label text-muted">All Revenue</div>
                <div class="value text-primary">${{ formatCurrency(entryTotals.total) }}</div>
              </div>
              <div class="filtered-total-card shadow-sm">
                <div class="label text-muted">Subscriptions</div>
                <div class="value text-success">${{ formatCurrency(entryTotals.subscription) }}</div>
              </div>
              <div class="filtered-total-card shadow-sm">
                <div class="label text-muted">Media Unlocks</div>
                <div class="value text-warning">${{ formatCurrency(entryTotals.unlock) }}</div>
              </div>
            </div>
          </div>

          <div
            v-if="!loading.entries && entries.length > 0"
            class="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-4"
          >
            <div class="text-muted small">
              Showing {{ paginationStart }}–{{ paginationEnd }} of {{ pagination.total }} records
            </div>
            <div class="btn-group">
              <button
                class="btn btn-outline-secondary"
                type="button"
                @click="changePage(pagination.page - 1)"
                :disabled="pagination.page === 1 || loading.entries"
              >
                Previous
              </button>
              <button
                class="btn btn-outline-secondary"
                type="button"
                @click="changePage(pagination.page + 1)"
                :disabled="pagination.page >= pagination.pages || loading.entries"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { io } from 'socket.io-client';
import api from '../../services/api';

const formatInputDate = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '';
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default {
  name: 'ManagerRevenue',
  data() {
    const currentYear = new Date().getFullYear();
    return {
      summary: {
        year: currentYear,
        months: [],
        totals: {
          totalRevenue: 0,
          subscriptionRevenue: 0,
          unlockRevenue: 0
        },
        availableYears: [currentYear],
        subscriberCount: 0
      },
      entries: [],
      pagination: {
        page: 1,
        pages: 1,
        total: 0,
        limit: 25
      },
      filters: {
        type: 'all',
        startDate: '',
        endDate: '',
        search: '',
        sortBy: 'date',
        sortOrder: 'desc'
      },
      selectedMonth: '',
      loading: {
        summary: false,
        entries: false
      },
      entryTotals: {
        total: 0,
        subscription: 0,
        unlock: 0
      },
      socket: null,
      socketConnected: false,
      refreshScheduled: false,
      debouncedSearchTimeout: null,
      initializing: true,
      updatingFromMonth: false,
      suspendFilterWatchers: false
    };
  },
  computed: {
    ...mapGetters('auth', ['token']),
    maxMonthFilter() {
      return `${this.summary.year}-${String(12).padStart(2, '0')}`;
    },
    paginationStart() {
      if (this.pagination.total === 0) return 0;
      return (this.pagination.page - 1) * this.pagination.limit + 1;
    },
    paginationEnd() {
      return Math.min(this.pagination.page * this.pagination.limit, this.pagination.total);
    },
    isRefreshing() {
      return this.loading.summary || this.loading.entries;
    },
    hasActiveFilters() {
      return Boolean(
        this.filters.type !== 'all' ||
        this.selectedMonth ||
        this.filters.startDate ||
        this.filters.endDate ||
        (this.filters.search && this.filters.search.trim().length > 0) ||
        this.filters.sortBy !== 'date' ||
        this.filters.sortOrder !== 'desc'
      );
    }
  },
  watch: {
    'summary.year': async function handleYearChange(newYear, oldYear) {
      if (this.initializing || newYear === oldYear) {
        return;
      }
      this.pagination.page = 1;
      await Promise.all([this.fetchSummary(), this.fetchEntries()]);
    },
    'filters.type': 'handleFilterChange',
    'filters.sortBy': 'handleFilterChange',
    'filters.sortOrder': 'handleFilterChange',
    'filters.startDate'(value, previous) {
      if (this.initializing || this.suspendFilterWatchers || this.updatingFromMonth || value === previous) {
        return;
      }
      if (!this.updatingFromMonth) {
        this.selectedMonth = '';
      }
      this.handleFilterChange();
    },
    'filters.endDate'(value, previous) {
      if (this.initializing || this.suspendFilterWatchers || this.updatingFromMonth || value === previous) {
        return;
      }
      if (!this.updatingFromMonth) {
        this.selectedMonth = '';
      }
      this.handleFilterChange();
    },
    selectedMonth(value, previous) {
      if (this.initializing || this.suspendFilterWatchers || value === previous) {
        return;
      }
      this.updatingFromMonth = true;

      if (!value) {
        this.filters.startDate = '';
        this.filters.endDate = '';
        this.$nextTick(() => {
          this.updatingFromMonth = false;
          this.handleFilterChange();
        });
        return;
      }

      const [yearPart, monthPart] = value.split('-');
      const yearNumber = parseInt(yearPart, 10);
      const monthNumber = parseInt(monthPart, 10);

      if (!Number.isInteger(yearNumber) || !Number.isInteger(monthNumber)) {
        this.updatingFromMonth = false;
        return;
      }

      const start = new Date(yearNumber, monthNumber - 1, 1);
      const end = new Date(yearNumber, monthNumber, 0);

      this.filters.startDate = formatInputDate(start);
      this.filters.endDate = formatInputDate(end);

      this.$nextTick(() => {
        this.updatingFromMonth = false;
        this.handleFilterChange();
      });
    },
    'filters.search'(value) {
      if (this.initializing || this.suspendFilterWatchers) {
        return;
      }
      if (this.debouncedSearchTimeout) {
        clearTimeout(this.debouncedSearchTimeout);
      }
      this.debouncedSearchTimeout = setTimeout(() => {
        this.handleFilterChange();
      }, 350);
    }
  },
  async created() {
    await this.initialize();
  },
  beforeUnmount() {
    this.disconnectSocket();
    if (this.debouncedSearchTimeout) {
      clearTimeout(this.debouncedSearchTimeout);
    }
  },
  methods: {
    async initialize() {
      try {
        await Promise.all([this.fetchSummary(), this.fetchEntries()]);
        this.connectSocket();
      } finally {
        this.initializing = false;
      }
    },
    async fetchSummary() {
      this.loading.summary = true;
      try {
        const response = await api.get('/manager/revenue/summary', {
          params: { year: this.summary.year }
        });

        const { year, months, totals, availableYears, subscriberCount } = response.data || {};
        this.summary.year = year || this.summary.year;
        this.summary.months = Array.isArray(months) ? months : [];
        this.summary.totals = {
          totalRevenue: totals?.totalRevenue || 0,
          subscriptionRevenue: totals?.subscriptionRevenue || 0,
          unlockRevenue: totals?.unlockRevenue || 0
        };
        this.summary.subscriberCount = subscriberCount || 0;
        if (Array.isArray(availableYears) && availableYears.length > 0) {
          this.summary.availableYears = availableYears;
        } else if (!this.summary.availableYears.includes(this.summary.year)) {
          this.summary.availableYears = [...this.summary.availableYears, this.summary.year].sort((a, b) => a - b);
        }
      } catch (error) {
        console.error('Error fetching manager revenue summary:', error);
      } finally {
        this.loading.summary = false;
      }
    },
    async fetchEntries() {
      this.loading.entries = true;
      try {
        const params = {
          page: this.pagination.page,
          limit: this.pagination.limit,
          sortBy: this.filters.sortBy,
          sortOrder: this.filters.sortOrder
        };

        if (this.filters.type !== 'all') {
          params.type = this.filters.type;
        }
        if (this.filters.startDate) {
          params.startDate = this.filters.startDate;
        }
        if (this.filters.endDate) {
          params.endDate = this.filters.endDate;
        }
        if (this.filters.search && this.filters.search.trim().length > 0) {
          params.search = this.filters.search.trim();
        }

        const response = await api.get('/manager/revenue/entries', { params });
        this.entries = response.data?.entries || [];
        if (response.data?.pagination) {
          this.pagination = {
            ...this.pagination,
            ...response.data.pagination
          };
        } else {
          this.pagination.total = this.entries.length;
          this.pagination.pages = 1;
        }

        const totalsResponse = response.data?.totals || {};
        this.entryTotals = {
          total: Number(totalsResponse.total) || 0,
          subscription: Number(totalsResponse.subscription) || 0,
          unlock: Number(totalsResponse.unlock) || 0
        };
      } catch (error) {
        console.error('Error fetching manager revenue entries:', error);
        this.entryTotals = { total: 0, subscription: 0, unlock: 0 };
      } finally {
        this.loading.entries = false;
      }
    },
    async refreshData() {
      await Promise.all([this.fetchSummary(), this.fetchEntries()]);
    },
    changePage(page) {
      if (page < 1 || page > this.pagination.pages || page === this.pagination.page) {
        return;
      }
      this.pagination.page = page;
      this.fetchEntries();
    },
    handleFilterChange() {
      if (this.initializing || this.suspendFilterWatchers) {
        return;
      }
      this.pagination.page = 1;
      this.fetchEntries();
    },
    toggleSortOrder() {
      this.filters.sortOrder = this.filters.sortOrder === 'desc' ? 'asc' : 'desc';
    },
    clearFilters() {
      if (!this.hasActiveFilters) {
        return;
      }

      this.suspendFilterWatchers = true;
      this.filters.type = 'all';
      this.filters.startDate = '';
      this.filters.endDate = '';
      this.filters.search = '';
      this.filters.sortBy = 'date';
      this.filters.sortOrder = 'desc';
      this.selectedMonth = '';
      this.pagination.page = 1;
      this.suspendFilterWatchers = false;
      this.fetchEntries();
    },
    connectSocket() {
      if (this.socket) {
        return;
      }
      const authToken = this.token || localStorage.getItem('token');
      if (!authToken) {
        return;
      }

      this.socket = io('http://localhost:3000', {
        auth: { token: authToken },
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        this.socketConnected = true;
      });

      this.socket.on('disconnect', () => {
        this.socketConnected = false;
      });

      this.socket.on('revenue_update', this.handleRevenueUpdate);
    },
    disconnectSocket() {
      if (this.socket) {
        this.socket.off('revenue_update', this.handleRevenueUpdate);
        this.socket.disconnect();
        this.socket = null;
      }
      this.socketConnected = false;
    },
    handleRevenueUpdate() {
      if (this.refreshScheduled) {
        return;
      }
      this.refreshScheduled = true;
      setTimeout(async () => {
        await this.refreshData();
        this.refreshScheduled = false;
      }, 400);
    },
    formatCurrency(value) {
      const amount = Number(value) || 0;
      return amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    formatDate(value) {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return '—';
      }
      return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    formatGrowth(value) {
      if (value === null || Number.isNaN(Number(value))) {
        return '0.0%';
      }
      return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
    },
    growthClass(value) {
      if (value === null) {
        return 'text-muted';
      }
      if (value >= 0) {
        return 'text-success';
      }
      return 'text-danger';
    }
  }
};
</script>

<style scoped>
.revenue-view {
  min-height: 100vh;
  background-color: #f7f9fb;
}

.page-title {
  font-weight: 700;
  color: #1a1a1a;
}

.live-indicator {
  background-color: #eef2f7;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
}

.status-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}

.summary-card {
  padding: 1.25rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  background-color: #ffffff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(15, 96, 255, 0.08);
}

.summary-month {
  font-size: 0.95rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-total {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0d6efd;
}

.summary-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.9rem;
}

.summary-growth {
  font-weight: 600;
  font-size: 0.95rem;
}

.summary-totals {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.total-card {
  padding: 1.25rem;
  border-radius: 16px;
  background-color: #ffffff;
}

.total-card .label {
  font-size: 0.85rem;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.total-card .value {
  font-size: 1.4rem;
  font-weight: 700;
}

.filters .form-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.table {
  border-radius: 12px;
  overflow: hidden;
}

.table thead {
  background-color: #f1f4f8;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.table tbody tr td {
  vertical-align: middle;
}

.bg-primary-subtle {
  background-color: rgba(13, 110, 253, 0.1) !important;
}

.bg-warning-subtle {
  background-color: rgba(255, 193, 7, 0.15) !important;
}

.filtered-totals .totals-header {
  font-size: 0.75rem;
  letter-spacing: 0.4px;
}

.totals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.filtered-total-card {
  padding: 1.1rem;
  border-radius: 14px;
  background-color: #ffffff;
}

.filtered-total-card .label {
  font-size: 0.8rem;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.filtered-total-card .value {
  font-size: 1.3rem;
  font-weight: 700;
}

@media (max-width: 992px) {
  .filters .form-label {
    display: block;
  }
}
</style>

