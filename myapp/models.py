# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.
class mytable(models.Model):
    name = models.CharField(max_length=30)
    dob = models.CharField(max_length=80)
    #age = models.IntegerField()
    skills = models.CharField(max_length=60)
    hobbies = models.CharField(max_length=60)
    gender = models.CharField(max_length=10)