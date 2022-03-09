describe("authentication", () => {
  const originalUrl = `${Cypress.env("VITE_API_URL")}/login`;
  it("should navigate to redirect page and not found url", () => {
    const urlId = "xxxxx";
    cy.intercept(
      {
        method: "GET",
        url: `url/${urlId}`,
        hostname: "localhost",
      },
      {
        statusCode: 404,
        body: {
          message: "Url not found",
        },
      }
    );
    cy.visit(`/${urlId}`);
    cy.get('[data-test-id="img-not-found"]').should("be.visible");
  });
  it("should navigate to redirect page and found url", () => {
    const urlId = "xxxxx";
    cy.intercept(
      {
        method: "GET",
        url: `url/${urlId}`,
        hostname: "localhost",
      },
      {
        statusCode: 200,
        body: {
          originalUrl,
        },
      }
    );
    cy.visit(`/${urlId}`);
    cy.url().should("include", "/login");
  });
});
