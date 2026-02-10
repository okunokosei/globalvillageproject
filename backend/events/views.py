from django.shortcuts import render
from rest_framework import generics
from .models import Events, EventParticipant
from .serializers import EventSerializer, EventParticipantSerializer

# Create your views here.
class EventListView(generics.ListCreateAPIView):
    queryset = Events.objects.all().order_by('date')
    serializer_class = EventSerializer

class EventParticipantListView(generics.ListCreateAPIView):
    queryset = EventParticipant.objects.all()
    serializer_class = EventParticipantSerializer