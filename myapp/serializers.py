from rest_framework import serializers
from myapp.models import mytable


class mytableSerializer(serializers.ModelSerializer):

    class Meta:
        model = mytable
        fields = ('name', 'dob','skills', 'hobbies','gender',)
