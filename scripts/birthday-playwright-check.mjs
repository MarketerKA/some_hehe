import { chromium, devices } from 'playwright';

const baseUrl = 'http://127.0.0.1:4173/some_hehe/birthday';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function solveMemoryGame(page) {
  console.log('Step 1: memory');
  const buttons = page.locator('.birthday-smart-game__candle');
  const patterns = [
    [0, 2],
    [3, 1, 2],
    [1, 3, 0, 2],
  ];

  for (let round = 0; round < patterns.length; round += 1) {
    await page.waitForFunction(
      () => {
        const firstButton = document.querySelector('.birthday-smart-game__candle');
        return firstButton instanceof HTMLButtonElement && !firstButton.disabled;
      },
      { timeout: 8000 },
    );

    for (const index of patterns[round]) {
      await buttons.nth(index).click();
      await wait(120);
    }

    await wait(round === 2 ? 2600 : 1600);
  }
}

async function solvePuzzle(page) {
  console.log('Step 2: puzzle');
  const getTileOrder = async () =>
    page.locator('.birthday-puzzle__tile').evaluateAll((nodes) =>
      nodes.map((node) => {
        const style = node.getAttribute('style') ?? '';
        const xMatch = style.match(/--bg-x:\s*([^;]+)/);
        const yMatch = style.match(/--bg-y:\s*([^;]+)/);
        const x = xMatch?.[1]?.trim() ?? '0%';
        const y = yMatch?.[1]?.trim() ?? '0%';
        return `${x}|${y}`;
      }),
    );

  const target = ['0%|0%', '50%|0%', '100%|0%', '0%|50%', '50%|50%', '100%|50%', '0%|100%', '50%|100%', '100%|100%'];

  for (let i = 0; i < target.length; i += 1) {
    const current = await getTileOrder();
    if (current[i] === target[i]) {
      continue;
    }

    const swapIndex = current.findIndex((value, index) => index > i && value === target[i]);
    await page.locator('.birthday-puzzle__tile').nth(i).click();
    await page.locator('.birthday-puzzle__tile').nth(swapIndex).click();
    await wait(200);
  }

  await wait(2600);
}

async function solveAngel(page) {
  console.log('Step 3: angel');
  await page.getByRole('button', { name: 'Полетели', exact: true }).click();

  for (let attempt = 0; attempt < 900; attempt += 1) {
    const state = await page.evaluate(() => {
      const hero = document.querySelector('.birthday-angel__hero');
      const arena = document.querySelector('.birthday-angel__arena');
      const columns = Array.from(document.querySelectorAll('.birthday-angel__column'));
      const overlayText = document.querySelector('.birthday-angel__overlay h3')?.textContent ?? '';

      if (!hero || !arena) {
        return null;
      }

      const heroRect = hero.getBoundingClientRect();
      const arenaRect = arena.getBoundingClientRect();
      const heroCenterY = heroRect.top - arenaRect.top + heroRect.height / 2;
      const heroRight = heroRect.right - arenaRect.left;

      const obstaclePairs = [];
      for (let index = 0; index < columns.length; index += 2) {
        const top = columns[index];
        const bottom = columns[index + 1];
        if (!top || !bottom) {
          continue;
        }
        const topRect = top.getBoundingClientRect();
        const bottomRect = bottom.getBoundingClientRect();
        obstaclePairs.push({
          left: topRect.left - arenaRect.left,
          right: topRect.right - arenaRect.left,
          gapCenter: (topRect.bottom - arenaRect.top + bottomRect.top - arenaRect.top) / 2,
        });
      }

      const nextObstacle = obstaclePairs
        .filter((item) => item.right >= heroRight - 10)
        .sort((a, b) => a.left - b.left)[0] ?? null;

      return {
        heroCenterY,
        overlayText,
        nextObstacle,
        scoreText: document.querySelector('.birthday-angel__hud strong')?.textContent ?? '',
      };
    });

    if (!state) {
      throw new Error('Angel game DOM not available');
    }

    if (state.overlayText.includes('Идеальный полет')) {
      console.log('Angel completed');
      await wait(2500);
      return;
    }

    if (state.overlayText.includes('Еще один полет')) {
      console.log('Angel retry');
      await page.getByRole('button', { name: 'Попробовать снова', exact: true }).click();
      await wait(200);
      await page.getByRole('button', { name: 'Полетели', exact: true }).click();
      continue;
    }

    if (attempt % 60 === 0) {
      console.log('Angel status', JSON.stringify(state));
    }

    const shouldFlap =
      !state.nextObstacle ||
      state.heroCenterY > state.nextObstacle.gapCenter + 10;

    if (shouldFlap) {
      await page.locator('.birthday-angel__arena').click({ position: { x: 160, y: 210 } });
    }

    await wait(55);
  }

  throw new Error('Angel game was not completed in time');
}

async function solveGift(page) {
  console.log('Step 4: gift');
  const boxes = page.locator('.birthday-gift__box');
  const total = await boxes.count();
  for (let index = 0; index < total; index += 1) {
    await boxes.nth(index).click();
    await wait(200);
    const hint = await page.locator('.birthday-gift__hint').textContent();
    if (hint?.includes('Нашла')) {
      break;
    }
  }
  await wait(2600);
}

async function solveConstellation(page) {
  console.log('Step 5: constellation');
  const stars = page.locator('.birthday-constellation__star');
  const total = await stars.count();
  for (let index = 0; index < total; index += 1) {
    await stars.nth(index).click();
    await wait(150);
  }
  await wait(2500);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  ...devices['iPhone 13'],
});
const page = await context.newPage();

page.on('pageerror', (error) => {
  console.error('PAGEERROR', error);
});

await page.goto(baseUrl, { waitUntil: 'networkidle' });
console.log('Opened birthday route');
await page.screenshot({ path: '/tmp/birthday-intro.png', fullPage: true });
await page.getByRole('button', { name: 'Начать праздник' }).click();
await page.waitForSelector('.birthday-smart-game__grid');

await solveMemoryGame(page);
await page.waitForSelector('.birthday-puzzle__board');
await page.screenshot({ path: '/tmp/birthday-step2.png', fullPage: true });

await solvePuzzle(page);
await page.waitForSelector('.birthday-angel__arena');

await solveAngel(page);
await page.waitForSelector('.birthday-gift__grid');

await solveGift(page);
await page.waitForSelector('.birthday-constellation__sky');

await solveConstellation(page);
await page.waitForSelector('.birthday-final__certificate');
await page.screenshot({ path: '/tmp/birthday-final.png', fullPage: true });

console.log('Birthday quest flow completed successfully');

await browser.close();
