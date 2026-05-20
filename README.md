Sirtaj Gill

1. I would fit my automated tests within a GitHub Action that runs whenever code is pushed because it makes the tests run automatically whenever new code is pushed before it is finalized.

2. I would not use an end to end test to check if a function is returning the correct output.

3. Navigation mode analyzes the page right after it loads. It is best for checking overall page load performance, like speed and loading metrics and snapshot mode analyzes the page in its current state. snapshot is better for checking accessibility or layout issues after the page is already loaded, but it does not measure full page load performance or JavaScript interactions. Lighthouse also has Timespan mode, which is better for testing interactions over time.

4. Three things we could do to improve the CSE 110 shop site based on the Lighthouse results are to optimize the product images by compressing them, resizing them, or using more efficient formats so the page loads faster add explicit width and height attributes to image elements so the browser can reserve space for them and reduce layout shifting while the page loads and add or improve the meta description in the page’s head section so the site has better SEO information for search engines and Lighthouse’s SEO audit. Lighthouse specifically checks for image optimization opportunities and flags missing image dimensions because they can affect performance and layout stability.