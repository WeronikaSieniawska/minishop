from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from import_export import resources
from .models import Inventory, Suppliers, Customers, Invoice, PurchaseOrder, CustomerItems, SupplierItems

class InventoryResource(resources.ModelResource):
    class Meta:
        model = Inventory
        fields = ('item', 'description', 'quantity', 'purchasePrice', 'salePrice')

class SuppliersResource(resources.ModelResource):
    class Meta:
        model = Suppliers
        fields = ('sName',)

class CustomersResource(resources.ModelResource):
    class Meta:
        model = Customers
        fields = ('cName',)

class InvoiceResource(resources.ModelResource):
    class Meta:
        model = Invoice
        fields = ('customer', 'iPubDate', 'iTotal', 'iComplete')

class PurchaseOrderResource(resources.ModelResource):
    class Meta:
        model = PurchaseOrder
        fields = ('supplier', 'pubDate', 'total', 'complete')

class CustomerItemsResource(resources.ModelResource):
    class Meta:
        model = CustomerItems
        fields = ('cItem', 'amount')

class SupplierItemsResource(resources.ModelResource):
    class Meta:
        model = SupplierItems
        fields = ('sItem', 'amount')

@admin.register(Inventory)
class InventoryAdmin(ImportExportModelAdmin):
    list_display = ('item', 'description', 'quantity', 'purchasePrice', 'salePrice')
    resource_class = InventoryResource

@admin.register(Suppliers)
class SuppliersAdmin(ImportExportModelAdmin):
    list_display = ('sName',)
    resource_class = SuppliersResource

@admin.register(Customers)
class CustomersAdmin(ImportExportModelAdmin):
    list_display = ('cName',)
    resource_class = CustomersResource

@admin.register(Invoice)
class InvoiceAdmin(ImportExportModelAdmin):
    list_display = ('customer', 'iPubDate', 'iTotal', 'iComplete')
    resource_class = InvoiceResource

@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(ImportExportModelAdmin):
    list_display = ('supplier', 'pubDate', 'total', 'complete')
    resource_class = PurchaseOrderResource

@admin.register(CustomerItems)
class CustomerItemsAdmin(ImportExportModelAdmin):
    list_display = ('cItem', 'amount')
    resource_class = CustomerItemsResource

@admin.register(SupplierItems)
class SupplierItemsAdmin(ImportExportModelAdmin):
    list_display = ('sItem', 'amount')
    resource_class = SupplierItemsResource

# Dodatkowe dostosowanie panelu administracyjnego

admin.site.site_header = "Minishop Admin"
admin.site.site_title = "Minishop Admin Panel"
admin.site.index_title = "Welcome to Minishop Admin Panel"
