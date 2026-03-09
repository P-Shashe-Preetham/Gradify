import puppeteer from 'puppeteer';

(async () => {
  console.log("Starting E2E Note Generation Test...");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    console.log("Navigating to http://localhost:3000");
    await page.goto('http://localhost:3000');
    
    console.log("Waiting for dashboard to load...");
    await page.waitForSelector('#startLearningButton');
    
    console.log("Clicking Start Learning...");
    await page.click('#startLearningButton');

    console.log("Waiting for Note Generation screen...");
    await page.waitForSelector('#noteInput', { visible: true });
    
    console.log("Typing into textarea...");
    await page.type('#noteInput', 'Explain Quantum Physics');
    
    console.log("Checking if generate button is enabled...");
    const isBtnDisabled = await page.$eval('#generateButton', el => el.disabled);
    if (isBtnDisabled) {
      throw new Error("Generate button did not enable after typing!");
    }
    
    console.log("Clicking Generate Notes...");
    await page.click('#generateButton');
    
    console.log("Verifying loading state appears...");
    await page.waitForSelector('#loadingState', { visible: true });
    
    console.log("Waiting for generation result to appear (timeout 10s)...");
    await page.waitForSelector('#notesResult', { visible: true, timeout: 10000 });
    
    console.log("Checking generated Markdown content...");
    const htmlContent = await page.$eval('#notesContent', el => el.innerHTML);
    if (!htmlContent.includes("Study Notes: Explain Quantum Physics")) {
      throw new Error("Expected Markdown content did not render! HTML: " + htmlContent);
    }
    
    console.log("✅ SUCCESS: Note Generation E2E flow passed perfectly!");
  } catch (err) {
    console.error("❌ ERROR: Note Generation E2E flow failed!");
    console.error(err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
