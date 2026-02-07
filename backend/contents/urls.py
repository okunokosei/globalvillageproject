from django.urls import path
from .views import NoticeListView, NoticeTagListView, GuideListCreateView, GuideCategorySimpleListView, GuidePageListView

urlpatterns =[
    path('notices/', NoticeListView.as_view(), name='notice_list'),
    path('noticetags/', NoticeTagListView.as_view(), name='notice_tag_list'),
    path('guides/', GuideListCreateView.as_view(), name='guide_list_create'),
    path('guide-categories/', GuideCategorySimpleListView.as_view(), name='guide_category_simple'),
    path('guide-page/', GuidePageListView.as_view(), name='guide_page_data'),
]