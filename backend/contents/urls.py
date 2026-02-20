from django.urls import path
from .views import NoticeListView, NoticeTagListView

urlpatterns =[
    path('notices/', NoticeListView.as_view(), name='notice_list'),
    path('noticetags/', NoticeTagListView.as_view(), name='notice_tag_list'),
]