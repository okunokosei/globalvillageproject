from django.shortcuts import render

from rest_framework import generics
from .models import Notice, NoticeTag
from .serializers import NoticeSerializer, NoticeTagSerializer

class NoticeListView(generics.ListCreateAPIView):
    queryset = Notice.objects.all().order_by('-is_pinned', '-created_at')
    serializer_class = NoticeSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)
    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

class NoticeTagListView(generics.ListAPIView):
    queryset = NoticeTag.objects.all()
    serializer_class = NoticeTagSerializer



