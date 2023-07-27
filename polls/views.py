from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.views import generic
from django.utils import timezone

from .models import Choice, Question

from django.views import View

# Widok dla zakładki "Invoice of Sales"
class InvoiceOfSalesView(View):
    def get(self, request):
        # Tutaj możesz dodać odpowiednią logikę dla zakładki "Invoice of Sales"
        return render(request, 'polls/invoice_of_sales.html')

# Widok dla zakładki "Purchase Order"
class PurchaseOrderView(View):
    def get(self, request):
        # Tutaj możesz dodać odpowiednią logikę dla zakładki "Purchase Order"
        return render(request, 'polls/purchase_order.html')

# Widok dla zakładki "Income and Expenditure"
class IncomeAndExpenditureView(View):
    def get(self, request):
        # Tutaj możesz dodać odpowiednią logikę dla zakładki "Income and Expenditure"
        return render(request, 'polls/income_and_expenditure.html')

# Widok dla zakładki "Reports"
class ReportsView(View):
    def get(self, request):
        # Tutaj możesz dodać odpowiednią logikę dla zakładki "Reports"
        return render(request, 'polls/reports.html')



class IndexView(generic.ListView):
    template_name = "polls/index.html"
    context_object_name = "latest_question_list"

    def get_queryset(self):
        """
        Return the last five published questions (not including those set to be
        published in the future).
        """
        return Question.objects.filter(pub_date__lte=timezone.now()).order_by("-pub_date")[
            :5
        ]


class DetailView(generic.DetailView):
    model = Question
    template_name = "polls/detail.html"

    def get_queryset(self):
        """
        Excludes any questions that aren't published yet.
        """
        return Question.objects.filter(pub_date__lte=timezone.now())


class ResultsView(generic.DetailView):
    model = Question
    template_name = "polls/results.html"


def vote(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    try:
        selected_choice = question.choice_set.get(pk=request.POST["choice"])
    except (KeyError, Choice.DoesNotExist):
        # Redisplay the question voting form.
        return render(
            request,
            "polls/detail.html",
            {
                "question": question,
                "error_message": "You didn't select a choice.",
            },
        )
    else:
        selected_choice.votes += 1
        selected_choice.save()
        # Always return an HttpResponseRedirect after successfully dealing
        # with POST data. This prevents data from being posted twice if a
        # user hits the Back button.
        return HttpResponseRedirect(reverse("polls:results", args=(question.id,)))
""
