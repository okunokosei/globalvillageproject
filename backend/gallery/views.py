from django.shortcuts import render

from .models import Gallery
from .serializers import GallerySerializer

from rest_framework import generics

# Create your views here.

class GalleryListCreateView(generics.ListCreateAPIView):
    queryset = Gallery.objects.all().order_by('event_date', 'created_at')
    serializer_class = GallerySerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)