from django.http.response import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
from .cnn_model_get_output import return_output
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import serializers

class output_class:
    def __init__(self,body):
        self.body = body

class serializer_output(serializers.Serializer):
    body = serializers.DictField()

@api_view(['POST'])
def get_output(request):
    sent_data=request.data
    matrix=sent_data["matrix"]
    output=return_output(matrix)
    model_output=output_class(output)
    serialized_output=serializer_output(model_output)
    return Response(serialized_output.data)
