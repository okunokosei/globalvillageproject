from django.urls import path
from .views import NoticeListView, GuideListView

urlpatterns =[
    path('notices/', NoticeListView.as_view(), name='notice-list'),
    path('guides/', GuideListView.as_view(), name='guide-list'),
]