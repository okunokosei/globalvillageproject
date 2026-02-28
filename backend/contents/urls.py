from django.urls import path
from .views import NoticeListView, NoticeTagListView, NoticeDetailView

urlpatterns =[
    path('notices/', NoticeListView.as_view(), name='notice_list'),
    path('notices/<pk>/', NoticeDetailView.as_view(), name='notice_detail'),
    path('noticetags/', NoticeTagListView.as_view(), name='notice_tag_list'),
]