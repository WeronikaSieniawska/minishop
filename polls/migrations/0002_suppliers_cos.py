# Generated by Django 4.2.3 on 2023-07-29 17:22

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("polls", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="suppliers",
            name="cos",
            field=models.TextField(default="", max_length=40),
        ),
    ]
