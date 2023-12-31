# Generated by Django 4.2.3 on 2023-08-02 13:43

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("polls", "0004_inventory_amount"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="inventory",
            name="amount",
        ),
        migrations.CreateModel(
            name="CustomerItems",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "amount",
                    models.IntegerField(
                        blank=True,
                        default=0,
                        null=True,
                        validators=[django.core.validators.MinValueValidator(0)],
                    ),
                ),
                (
                    "cItem",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="polls.inventory",
                    ),
                ),
                (
                    "invoice",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="polls.invoice"
                    ),
                ),
            ],
        ),
    ]
