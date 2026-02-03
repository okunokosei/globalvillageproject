from django.shortcuts import render

from rest_framework import generics
from .models import Notice, GuideCategories
from .serializers import NoticeSerializer, GuideCategorySerializer

class NoticeListView(generics.ListAPIView):
    queryset = Notice.objects.all().order_by('-is_pinned', '-created_at')
    serializer_class = NoticeSerializer

class GuideListView(generics.ListAPIView):
    queryset = GuideCategories.objects.all()
    serializer_class = GuideCategorySerializer
