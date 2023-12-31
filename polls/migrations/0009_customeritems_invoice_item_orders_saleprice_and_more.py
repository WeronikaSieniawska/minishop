# Generated by Django 4.2.3 on 2023-08-09 13:02

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("polls", "0008_orders"),
    ]

    operations = [
        migrations.AddField(
            model_name="customeritems",
            name="invoice_item",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="orders",
            name="salePrice",
            field=models.FloatField(
                default=0, validators=[django.core.validators.MinValueValidator(0.01)]
            ),
        ),
        migrations.AddField(
            model_name="supplieritems",
            name="order_item",
            field=models.BooleanField(default=False),
        ),
    ]
