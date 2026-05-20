describe('Basic user flow for Website', () => {
  const shopURL = 'https://cse110-sp25.github.io/CSE110-Shop/';

  // First, visit the lab 7 website
  beforeAll(async () => {
    await page.goto(shopURL, { waitUntil: 'domcontentloaded' });

    // Start the suite from a clean cart so old browser localStorage does not affect the tests.
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelectorAll('product-item').length === 20);
  });

  // Each it() call is a separate test
  // Here, we check to make sure that all 20 <product-item> elements have loaded
  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');

    // Query select all of the <product-item> elements and return the length of that array
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });

    // Expect there that array from earlier to be of length 20, meaning 20 <product-item> elements where found
    expect(numProducts).toBe(20);
  });

  // Check to make sure that all 20 <product-item> elements have data in them
  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');

    // Query select all of the <product-item> elements and check their data
    const allArePopulated = await page.$$eval('product-item', prodItems => {
      return prodItems.every(item => {
        const data = item.data;

        return data &&
          data.title !== undefined &&
          data.price !== undefined &&
          data.image !== undefined &&
          String(data.title).length > 0 &&
          String(data.price).length > 0 &&
          String(data.image).length > 0;
      });
    });

    // Expect allArePopulated to be true
    expect(allArePopulated).toBe(true);
  }, 10000);

  // Check to make sure that when you click "Add to Cart" on the first <product-item> that
  // the button swaps to "Remove from Cart"
  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');

    // Query the first <product-item>, then click its shadow DOM button
    const productItem = await page.$('product-item');
    const buttonTextBefore = await page.evaluate(product => {
      return product.shadowRoot.querySelector('button').innerText.trim();
    }, productItem);

    expect(buttonTextBefore).toBe('Add to Cart');

    await page.evaluate(product => {
      product.shadowRoot.querySelector('button').click();
    }, productItem);

    await page.waitForFunction(() => {
      const product = document.querySelector('product-item');
      return product.shadowRoot.querySelector('button').innerText.trim() === 'Remove from Cart';
    });

    const buttonTextAfter = await page.evaluate(product => {
      return product.shadowRoot.querySelector('button').innerText.trim();
    }, productItem);

    expect(buttonTextAfter).toBe('Remove from Cart');
  }, 2500);

  // Check to make sure that after clicking "Add to Cart" on every <product-item> that the Cart
  // number in the top right has been correctly updated
  it('Checking number of items in cart on screen', async () => {
    console.log('Checking number of items in cart on screen...');

    // Click only buttons that still say "Add to Cart" so the first item from the previous test
    // does not get removed accidentally.
    await page.$$eval('product-item', prodItems => {
      prodItems.forEach(item => {
        const button = item.shadowRoot.querySelector('button');

        if (button.innerText.trim() === 'Add to Cart') {
          button.click();
        }
      });
    });

    await page.waitForFunction(() => {
      return document.querySelector('#cart-count').innerText.trim() === '20';
    });

    const cartCount = await page.$eval('#cart-count', count => count.innerText.trim());

    expect(cartCount).toBe('20');
  }, 10000);

  // Check to make sure that after you reload the page it remembers all of the items in your cart
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelectorAll('product-item').length === 20);

    const allButtonsSayRemove = await page.$$eval('product-item', prodItems => {
      return prodItems.every(item => {
        const button = item.shadowRoot.querySelector('button');
        return button.innerText.trim() === 'Remove from Cart';
      });
    });

    const cartCount = await page.$eval('#cart-count', count => count.innerText.trim());

    expect(allButtonsSayRemove).toBe(true);
    expect(cartCount).toBe('20');
  }, 10000);

  // Check to make sure that the cart in localStorage is what you expect
  it('Checking the localStorage to make sure cart is correct', async () => {
    const cart = await page.evaluate(() => localStorage.getItem('cart'));

    expect(cart).toBe('[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]');
  });

  // Checking to make sure that if you remove all of the items from the cart that the cart
  // number in the top right of the screen is 0
  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Checking number of items in cart on screen...');

    await page.$$eval('product-item', prodItems => {
      prodItems.forEach(item => {
        const button = item.shadowRoot.querySelector('button');

        if (button.innerText.trim() === 'Remove from Cart') {
          button.click();
        }
      });
    });

    await page.waitForFunction(() => {
      return document.querySelector('#cart-count').innerText.trim() === '0';
    });

    const cartCount = await page.$eval('#cart-count', count => count.innerText.trim());

    expect(cartCount).toBe('0');
  }, 10000);

  // Checking to make sure that it remembers us removing everything from the cart
  // after we refresh the page
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelectorAll('product-item').length === 20);

    const allButtonsSayAdd = await page.$$eval('product-item', prodItems => {
      return prodItems.every(item => {
        const button = item.shadowRoot.querySelector('button');
        return button.innerText.trim() === 'Add to Cart';
      });
    });

    const cartCount = await page.$eval('#cart-count', count => count.innerText.trim());

    expect(allButtonsSayAdd).toBe(true);
    expect(cartCount).toBe('0');
  }, 10000);

  // Checking to make sure that localStorage for the cart is as we'd expect for the
  // cart being empty
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');

    const cart = await page.evaluate(() => localStorage.getItem('cart'));

    expect(cart).toBe('[]');
  });
});