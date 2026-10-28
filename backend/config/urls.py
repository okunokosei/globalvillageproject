from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),
    path('api/', include('contents.urls')),
    path('api/events/', include('events.urls')),
    path('api/gallery/', include('gallery.urls')),
]

if settings.LOCAL_DEMO:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
