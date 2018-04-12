describe('webdriver.io page', function() {
  it('should have the right title', function() {
    browser.url('http://localhost:8080');
    const title = browser.getTitle();
    expect(title).toBe('Block Drop');
  });

  it('should look right', () => {
    const results = (<any>browser).checkDocument();
    results.forEach(result =>
      expect(result.isWithinMisMatchTolerance).toBe(true),
    );
  });
});
