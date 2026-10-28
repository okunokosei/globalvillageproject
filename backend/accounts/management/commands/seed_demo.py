"""Create fictional data in the dedicated local demo database only."""

from datetime import date, datetime, time, timedelta
from pathlib import Path

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone
from PIL import Image, ImageDraw

from contents.models import Notice, NoticeImage, NoticeTag
from events.models import EventImage, Events
from gallery.models import Gallery


DEMO_PASSWORD = 'LocalDemo2026!'


def demo_artwork(filename, theme):
    """Simple original geometric sample images, not photographs of the dorm."""
    relative = Path('demo') / filename
    target = Path(settings.MEDIA_ROOT) / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    background, foreground, accent = theme
    image = Image.new('RGB', (900, 600), background)
    draw = ImageDraw.Draw(image)
    draw.ellipse((540, -100, 1040, 400), fill=accent)
    draw.rounded_rectangle((80, 110, 480, 490), radius=32, fill=foreground)
    for row in range(3):
        for col in range(3):
            x, y = 130 + col * 110, 160 + row * 100
            draw.rounded_rectangle((x, y, x + 60, y + 55), radius=8, fill=background)
    draw.line((550, 450, 800, 450), fill=foreground, width=16)
    draw.line((550, 490, 720, 490), fill=foreground, width=10)
    image.save(target)
    return relative.as_posix()


class Command(BaseCommand):
    help = 'Populate LOCAL_DEMO with fictional accounts and sample content (repeatable).'

    def add_arguments(self, parser):
        parser.add_argument('--date', type=date.fromisoformat, default=timezone.localdate(),
                            help='Base date in YYYY-MM-DD; defaults to today.')

    def handle(self, *args, **options):
        database = settings.DATABASES['default']
        if (not settings.LOCAL_DEMO
                or database['ENGINE'] != 'django.db.backends.sqlite3'
                or Path(database['NAME']) != settings.BASE_DIR / 'demo.sqlite3'):
            raise CommandError('seed_demo requires LOCAL_DEMO=1 and the dedicated demo.sqlite3 database.')

        self.seed(options['date'])

    @transaction.atomic
    def seed(self, day):
        User = get_user_model()
        themes = [('#e8f0ff', '#436de0', '#b8cdfc'),
                  ('#edf8ee', '#397b63', '#b8ddaa'),
                  ('#fff1de', '#c07839', '#f5cf85')]
        pictures = [demo_artwork(f'community-{i}.png', theme) for i, theme in enumerate(themes)]

        for email, name, role, room in [
            ('resident@example.com', 'デモ 寮生', 'Resident', 'A101'),
            ('admin@example.com', 'デモ 管理者', 'Admin', 'A102'),
        ]:
            user, _ = User.objects.update_or_create(email=email, defaults={
                'name': name, 'role': role, 'room_number': room,
                'position': 'RT' if role == 'Admin' else 'Resident',
                'move_in_date': day.replace(day=1),
                'move_out_date': (day + timedelta(days=180)).replace(day=1),
                'language_preference': 'JP', 'is_active': True,
                'is_staff': role == 'Admin', 'is_superuser': role == 'Admin',
                'icon': pictures[0],
            })
            user.set_password(DEMO_PASSWORD)
            user.save(update_fields=['password'])
        admin = User.objects.get(email='admin@example.com')

        notice_rows = [
            ('important', '重要', '共用スペース利用のご案内', 'Shared space guidelines',
             'みんなが気持ちよく過ごせるよう、利用後の片付けにご協力ください。\n\nこれは画面紹介用の架空のお知らせです。', True),
            ('event', '交流', 'ウェルカム交流会を開催します', 'Welcome gathering',
             '新しい仲間と交流する会を企画しました。イベント画面から詳細をご覧ください。\n\n実際の開催案内ではありません。', False),
            ('facility', '施設', 'ラウンジの本棚を整理しました', 'Lounge bookshelf update',
             '読書や勉強の合間に、共用スペースをご利用ください。\n\nポートフォリオ用のデモデータです。', False),
        ]
        for i, (slug, label, title, english, body, pinned) in enumerate(notice_rows):
            tag, _ = NoticeTag.objects.update_or_create(slug=f'demo-{slug}', defaults={
                'name': label, 'color_code': '#3B82F6',
            })
            notice, _ = Notice.objects.update_or_create(title_en=english, defaults={
                'title_jp': title, 'body_jp': body,
                'body_en': 'Fictional sample content for a local portfolio demonstration.',
                'tag': tag, 'is_pinned': pinned, 'created_by': admin, 'updated_by': admin,
            })
            Notice.objects.filter(pk=notice.pk).update(
                created_at=timezone.make_aware(datetime.combine(day - timedelta(days=i), time(9))))
            NoticeImage.objects.update_or_create(notice=notice, image=pictures[i])

        for i, (title, english, offset) in enumerate([
            ('ウェルカム交流会', 'Welcome gathering', 0),
            ('週末のランゲージカフェ', 'Language cafe', 3),
            ('みんなで楽しむボードゲーム', 'Board game evening', 7),
        ]):
            event, _ = Events.objects.update_or_create(title_en=english, defaults={
                'title_jp': title, 'description_jp': '寮生同士で気軽に交流する時間です。\n初めての方もぜひご参加ください。\n\n※画面紹介用の架空のイベントです。',
                'description_en': 'A fictional community event for the portfolio demo.',
                'location': '共用ラウンジ（デモ）', 'date': day + timedelta(days=offset),
                'start_time': '18:00', 'end_time': '19:30',
                'google_form_url': '', 'created_by': admin, 'updated_by': admin,
            })
            EventImage.objects.update_or_create(event=event, image=pictures[i])

        for i, (title, english) in enumerate([
            ('春の交流会', 'Spring gathering'),
            ('ランゲージカフェ', 'Language cafe album'),
            ('ボードゲームの夕べ', 'Board game album'),
        ]):
            Gallery.objects.update_or_create(title_en=english, defaults={
                'title_jp': title, 'event_date': day - timedelta(days=(i + 1) * 7),
                'cover_image_url': pictures[i],
                'google_photos_url': 'https://example.com/', 'created_by': admin,
            })

        self.stdout.write(self.style.SUCCESS(f'Fictional demo data ready for {day}.'))
        self.stdout.write('resident@example.com / admin@example.com')
        self.stdout.write(f'Local-only password for both accounts: {DEMO_PASSWORD}')
