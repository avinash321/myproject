from django import forms

from .models import mytable

class mytableForm(forms.ModelForm):

    class Meta:
        model = mytable
        fields = ('name', 'dob','skills', 'hobbies','gender',)