from django.shortcuts import render, get_object_or_404
from django.views import View
from django.http import JsonResponse
from .models import Inventory, Customers, Invoice, CustomerItems, Suppliers, SupplierItems, PurchaseOrder
from datetime import datetime
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class InvoiceOfSalesView(View):
    def get(self, request):
        inventory_data = Inventory.objects.all()
        customers = Customers.objects.all()
        current_date = datetime.now().strftime("%Y-%m-%d")
        return render(request, 'polls/invoice_of_sales.html', {'inventory_data': inventory_data, 'customers': customers, 'current_date': current_date})
    
class SaveCustomerItemsView(View):
    def post(self, request):
        data = json.loads(request.body)
        customer_name = data.get('customer')
        invoice_date = data.get('iPubDate')
        total_amount = data.get('iTotal')
        items = data.get('items')

        if not customer_name:
            return JsonResponse({'error': 'Please provide a customer name.'}, status=400)

        if not invoice_date:
            return JsonResponse({'error': 'Please provide an invoice date.'}, status=400)

        if not total_amount:
            return JsonResponse({'error': 'Please provide a total amount.'}, status=400)

        customer, created = Customers.objects.get_or_create(cName=customer_name)

        invoice = Invoice(customer=customer, iPubDate=invoice_date, iTotal=total_amount, iComplete=False)
        invoice.save()

        for item_data in items:
            item_id = item_data.get('item_id')
            amount = item_data.get('amount')

            if item_id and amount and amount >= 1:
                try:
                    item = Inventory.objects.get(id=item_id)
                except Inventory.DoesNotExist:
                    continue

                customer_item = CustomerItems(invoice=invoice, cItem=item, amount=amount)
                customer_item.save()

        return JsonResponse({'message': 'Customer items saved successfully.'})
    
class AddCustomerView(View):
    def post(self, request):
        data = json.loads(request.body)
        customer_name = data.get('customer')

        if not customer_name:
            return JsonResponse({'error': 'Please provide a customer name.'}, status=400)

        customer, created = Customers.objects.get_or_create(cName=customer_name)

        return JsonResponse({'message': 'Customer added successfully.', 'customer_id': customer.id})

class CheckCustomerExistsView(View):
    def get(self, request):
        customer_name = request.GET.get('name')
        
        if not customer_name:
            return JsonResponse({'error': 'Please provide a customer name.'}, status=400)

        try:
            customer = Customers.objects.get(cName=customer_name)
        except Customers.DoesNotExist:
            return JsonResponse({'exists': False})

        return JsonResponse({'exists': True, 'customer_id': customer.id})
    
class PurchaseOrderView(View):
    def get(self, request):
        inventory_data = Inventory.objects.all()
        suppliers = Suppliers.objects.all()
        current_date = datetime.now().strftime("%Y-%m-%d")
        return render(request, 'polls/purchase_order.html', {'inventory_data': inventory_data, 'suppliers': suppliers, 'current_date': current_date})

class SaveSupplierItemsView(View):
    def post(self, request):
        data = json.loads(request.body)
        supplier_name = data.get('supplier')
        invoice_date = data.get('pubDate')
        total_amount = data.get('total')
        items = data.get('items')
        new_items = data.get('new_items')  # Get new items data

        if not supplier_name:
            return JsonResponse({'error': 'Please provide a supplier name.'}, status=400)

        if not invoice_date:
            return JsonResponse({'error': 'Please provide an invoice date.'}, status=400)

        if not total_amount:
            return JsonResponse({'error': 'Please provide a total amount.'}, status=400)

        supplier, created = Suppliers.objects.get_or_create(sName=supplier_name)

        invoice = PurchaseOrder(supplier=supplier, pubDate=invoice_date, total=total_amount, complete=False)
        invoice.save()

        # Save existing items
        for item_data in items:
            item_id = item_data.get('item_id')
            amount = item_data.get('amount')

            if item_id and amount and amount >= 1:
                try:
                    item = Inventory.objects.get(id=item_id)
                except Inventory.DoesNotExist:
                    continue

                supplier_item = SupplierItems(purchase=invoice, sItem=item, amount=amount)
                supplier_item.save()

        # Save new items
        for new_item_data in new_items:
            item_id = new_item_data.get('new_item')
            description = new_item_data.get('new_description')
            quantity = new_item_data.get('new_quantity', 0)
            purchase_price = new_item_data.get('new_purchase_price')

            if not item_id or not description or not purchase_price:
                return JsonResponse({'error': 'Please provide all required item details.'}, status=400)

            try:
                item = Inventory.objects.get(id=item_id)
            except Inventory.DoesNotExist:
                item = Inventory.objects.create(
                    item=item_id,
                    description=description,
                    quantity=quantity,
                    purchasePrice=purchase_price,
                    salePrice=0.0,  # You might need to adjust this based on your requirements
                )

            amount = new_item_data.get('amount')
            if amount and amount >= 1:
                supplier_item = SupplierItems(purchase=invoice, sItem=item, amount=amount)
                supplier_item.save()

        return JsonResponse({'message': 'Supplier items saved successfully.'})
    
class AddSupplierView(View):
    def post(self, request):
        data = json.loads(request.body)
        supplier_name = data.get('supplier')

        if not supplier_name:
            return JsonResponse({'error': 'Please provide a supplier name.'}, status=400)

        supplier, created = Suppliers.objects.get_or_create(sName=supplier_name)

        return JsonResponse({'message': 'Supplier added successfully.', 'Supplier_id': supplier.id})

class CheckSupplierExistsView(View):
    def get(self, request):
        supplier_name = request.GET.get('name')
        
        if not supplier_name:
            return JsonResponse({'error': 'Please provide a supplier name.'}, status=400)

        try:
            supplier = Suppliers.objects.get(sName=supplier_name)
        except Suppliers.DoesNotExist:
            return JsonResponse({'exists': False})

        return JsonResponse({'exists': True, 'supplier_id': supplier.id})

class IncomeAndExpenditureView(View):
    def get(self, request):
        # Fetch all the invoices and purchase orders
        invoices = Invoice.objects.all()
        purchase_orders = PurchaseOrder.objects.all()

        # Fetch the corresponding customer items and supplier items for each invoice and purchase order
        invoice_data = []
        for invoice in invoices:
            total_amount = invoice.iTotal
            items = CustomerItems.objects.filter(invoice=invoice)
            invoice_data.append({'invoice': invoice, 'items': items, 'total_amount': total_amount})

        purchase_order_data = []
        for purchase_order in purchase_orders:
            total_amount = purchase_order.total
            items = SupplierItems.objects.filter(purchase=purchase_order)
            purchase_order_data.append({'purchase_order': purchase_order, 'items': items, 'total_amount': total_amount})

        return render(request, 'polls/income_and_expenditure.html', {'invoice_data': invoice_data, 'purchase_order_data': purchase_order_data})

class MarkInvoiceComplete(APIView):
    def post(self, request, invoice_id):
        try:
            invoice = Invoice.objects.get(pk=invoice_id)
            invoice.iComplete = request.data.get("is_completed", False)
            invoice.save()
            return Response(status=status.HTTP_200_OK)
        except Invoice.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class MarkPurchaseOrderComplete(APIView):
    def post(self, request, purchase_order_id):
        try:
            purchase_order = PurchaseOrder.objects.get(pk=purchase_order_id)
            purchase_order.complete = request.data.get("is_completed", False)
            purchase_order.save()
            return Response(status=status.HTTP_200_OK)
        except PurchaseOrder.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class ReportsView(View):
    def get(self, request):
        return render(request, 'polls/reports.html')

