from django.shortcuts import render, get_object_or_404
from django.views import View
from django.http import JsonResponse
from .models import Inventory, Customers, Invoice, CustomerItems
from datetime import datetime
import json

class InvoiceOfSalesView(View):
    def get(self, request):
        inventory_data = Inventory.objects.all()
        customers = Customers.objects.all()
        current_date = datetime.now().strftime("%Y-%m-%d")
        return render(request, 'polls/invoice_of_sales.html', {'inventory_data': inventory_data, 'customers': customers, 'current_date': current_date})

    def post(self, request):
        if request.method == "POST":
            customer_name = request.POST.get('customer')
            invoice_date = request.POST.get('iPubDate')
            total_amount = request.POST.get('iTotal')

            customer, created = Customers.objects.get_or_create(cName=customer_name)

            invoice = Invoice(customer=customer, iPubDate=invoice_date, iTotal=total_amount, iComplete=False)
            invoice.save()

            for item in Inventory.objects.all():
                amount = request.POST.get(f'amount_{item.id}')
                if amount:
                    customer_item = CustomerItems(invoice=invoice, cItem=item, amount=amount)
                    customer_item.save()

        return JsonResponse({'status': 'success'})
    
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
    
class PurchaseOrderView(View):
    def get(self, request):
        inventory_data = Inventory.objects.all()
        customers = Customers.objects.all()
        current_date = datetime.now().strftime("%Y-%m-%d")
        return render(request, 'polls/purchase_order.html', {'inventory_data': inventory_data, 'customers': customers, 'current_date': current_date})

class IncomeAndExpenditureView(View):
    def get(self, request):
        return render(request, 'polls/income_and_expenditure.html')

class ReportsView(View):
    def get(self, request):
        return render(request, 'polls/reports.html')

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
