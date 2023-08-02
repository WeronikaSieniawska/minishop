from django.urls import path
from . import views

app_name = "polls"
urlpatterns = [
    path("invoice-of-sales/", views.InvoiceOfSalesView.as_view(), name="invoice_of_sales"),
    path("purchase-order/", views.PurchaseOrderView.as_view(), name="purchase_order"),
    path("income-and-expenditure/", views.IncomeAndExpenditureView.as_view(), name="income_and_expenditure"),
    path("reports/", views.ReportsView.as_view(), name="reports"),
    path("save_customer_items/", views.saveCustomerItems, name="save_customer_items"),
]
