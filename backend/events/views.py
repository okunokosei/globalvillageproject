from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
# from rest_framework.exceptions import PermissionDDenied
from .models import Events
from .serializers import EventSerializer

# Create your views here.
class EventListCreateView(generics.ListCreateAPIView):
    queryset = Events.objects.all().order_by('date', 'start_time')
    serializer_class = EventSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)
    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

