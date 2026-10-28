"""Capture the running local app with real API data; never mocks network responses."""

import argparse
from datetime import datetime
from pathlib import Path

from playwright.sync_api import expect, sync_playwright


ROOT = Path(__file__).resolve().parents[1]
FRONTEND = 'http://localhost:3000'
PASSWORD = 'LocalDemo2026!'


def login(page, email):
    page.goto(f'{FRONTEND}/login')
    page.locator('input[type="email"]').fill(email)
    page.locator('input[type="password"]').fill(PASSWORD)
    page.get_by_role('button', name='ログインする', exact=True).click()
    page.wait_for_url('**/dashboard')
    expect(page.get_by_text('共用スペース利用のご案内', exact=True)).to_be_visible()


def capture(page, output, name):
    page.evaluate('''() => {
        window.scrollTo(0, 0);
        document.querySelector('main')?.scrollTo(0, 0);
    }''')
    page.evaluate('document.fonts.ready')
    page.wait_for_function('''() => Array.from(document.images).every(
        image => image.complete && image.naturalWidth > 0
    )''')
    page.screenshot(path=str(output / f'{name}.png'), animations='disabled')
    print(f'Captured {name}.png')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--date', default='2026-10-28', help='Match seed_demo --date (YYYY-MM-DD).')
    parser.add_argument('--chrome', action='store_true', help='Use installed Google Chrome instead of Playwright Chromium.')
    args = parser.parse_args()
    fixed_time = datetime.fromisoformat(f'{args.date}T12:00:00+09:00')
    output = ROOT / 'docs' / 'screenshots'
    output.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(channel='chrome' if args.chrome else None)
        context = browser.new_context(viewport={'width': 390, 'height': 844},
                                      device_scale_factor=2, locale='ja-JP', timezone_id='Asia/Tokyo')
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.clock.set_fixed_time(fixed_time)

        # Verify the app redirects unauthenticated dashboard requests.
        page.goto(f'{FRONTEND}/dashboard')
        page.wait_for_url('**/login')
        login(page, 'resident@example.com')

        # Reload to dismiss the transient login toast before capture.
        page.goto(f'{FRONTEND}/dashboard')
        expect(page.get_by_text('共用スペース利用のご案内', exact=True)).to_be_visible()
        expect(page.get_by_role('button', name='New Notice', exact=True)).to_have_count(0)
        capture(page, output, 'home')

        page.get_by_role('link', name='Event', exact=True).click()
        expect(page.get_by_text('ウェルカム交流会', exact=True)).to_be_visible()
        capture(page, output, 'events')
        page.get_by_text('ウェルカム交流会', exact=True).click()
        expect(page.get_by_role('heading', name='ウェルカム交流会', exact=True).last).to_be_visible()
        capture(page, output, 'event-detail')

        page.goto(f'{FRONTEND}/dashboard/gallery')
        expect(page.get_by_text('春の交流会', exact=True)).to_be_visible()
        capture(page, output, 'gallery')

        page.get_by_role('link', name='Profile', exact=True).click()
        expect(page.get_by_text('デモ 寮生', exact=True)).to_be_visible()
        capture(page, output, 'profile')

        context.clear_cookies()
        login(page, 'admin@example.com')
        page.goto(f'{FRONTEND}/dashboard')
        # Existing floating action button is the only button containing the plus icon.
        page.locator('button').filter(has=page.locator('svg.lucide-plus')).click()
        page.get_by_role('button', name='New Notice', exact=True).click()
        expect(page.get_by_placeholder('日本語でタイトルを入力')).to_be_visible()
        expect(page.get_by_role('button', name='重要', exact=True)).to_be_visible()
        capture(page, output, 'admin-notice')

        assert not errors, f'Browser errors: {errors}'
        browser.close()
        print('Login, navigation, local images and admin form verified without browser errors.')


if __name__ == '__main__':
    main()
