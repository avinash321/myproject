# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from .forms import mytableForm
from django.core import serializers
from .models import mytable
import ast
import json
import logging
import unicodedata
import collections
from django.http import HttpResponse
from rest_framework.decorators import api_view
from myapp.serializers import mytableSerializer
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_protect, csrf_exempt

# Logger
LOG_FILENAME = 'example.log'
logging.basicConfig(filename=LOG_FILENAME,level=logging.DEBUG)

# Create your views here.
@csrf_exempt
def register(request):
	if request.POST:
		mydata = request.POST;
		mydata = mydata.dict()     #  Unicode Json data is displaying
		for i in mydata:
			mydata = i
			mydata = eval(mydata)
			#mydata = convert(mydata)
		mytype = mydata.get('mytype')

	# The logic Has to be Here
		if mytype == "addrow":
			name = mydata.get('name')
			dob = mydata.get('dob')

			skills = mydata.get('skills')
			skills = ','.join(skills)
			hobbies = mydata.get('hobbies')
			hobbies = ','.join(hobbies)
			gender = mydata.get('gender')
			gender = ','.join(gender)
			# Creating New Record in the Database
			result = mytable.objects.create(name = name, dob = dob, skills = skills, hobbies = hobbies, gender = gender)
			#return render(request, 'myapp/register.html', {"finaldata":finaldata})
			myresult = {"name":result.name,"dob":result.dob,"skills":result.skills,
			"hobbies":result.hobbies,"gender":result.gender}
			jsondata = json.dumps(myresult)
			return HttpResponse(jsondata, content_type="application/json")

		elif mytype == "delrow":
			name_del = mydata.get('myname')
			# Deleting Record from the table based on given name
			result = mytable.objects.filter(name=name_del).delete()
			myresult = {"name":name_del}
			jsondata = json.dumps(myresult)
			return HttpResponse(jsondata, content_type="application/json")



		elif mytype == "editrow":
			name = mydata.get('name')
			dob = mydata.get('dob')
			skills = mydata.get('skills')
			skills = ','.join(skills)
			hobbies = mydata.get('hobbies')
			hobbies = ','.join(hobbies)
			gender = mydata.get('gender')
			gender = ','.join(gender)
			
			result = mytable.objects.filter(name=name).update(name = name, dob = dob, skills = skills, 
			hobbies = hobbies, gender = gender)
			myresult = {"name":"avinash"}
			jsondata = json.dumps(myresult)
			logging.debug(jsondata)
			logging.debug("This is a test MEssage")
			return HttpResponse(jsondata, content_type="application/json")
	else:
		return render(request, 'myapp/register.html', {})

#New Implimentation
@api_view(['GET','POST'])
def tabledata(request):
   if request.method == 'GET':
       table_data = mytable.objects.all()
       serializer = mytableSerializer(table_data, many=True)
       return Response(serializer.data)
       #return HttpResponse(serializer.data, content_type="application/json")



def index(request):
	# Here i need to Write the logic for getting the the data from database
    return render(request, 'myapp/index.html', {})

def test(request):
	#return HttpResponse({ "name":"John", "age":31, "city":"New York" }, content_type="application/json")
	return render(request, 'myapp/test.html', {})