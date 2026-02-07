from django.urls import path
from .views import NoticeListView, NoticeTagListView, GuideListView

urlpatterns =[
    path('notices/', NoticeListView.as_view(), name='notice-list'),
    path('noticetags/', NoticeTagListView.as_view(), name='notice-tag-list'),
    path('guides/', GuideListView.as_view(), name='guide-list'),
]