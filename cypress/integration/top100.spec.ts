describe("authentication", () => {
  const accessToken =
    "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDY0OTA4NjksImVtYWlsIjoiZXhhbXBsZUBlbWFpbC5jb20ifQ.k_b8OIG-gPxoz_NFivATPPKdOAb6KbA76A8PjHsHPc4";
  const url = {
    id: "XXXXXX",
    originalUrl: `${Cypress.env("VITE_API_URL")}/login`,
    views: 5,
  };
  it("should navigate to top100 page when click in top100 tap on header", () => {
    cy.visit("/");
    cy.get('[data-test-id="link-to-top100"]').click();
    cy.url().should("include", "/top100");
  });
  it("should show not found urls message when api response with 404 code", () => {
    cy.intercept(
      {
        method: "GET",
        url: `url/mostViewed`,
        hostname: "localhost",
      },
      {
        statusCode: 404,
      }
    );
    cy.visit("/top100");
    cy.get('[data-test-id="not-found-url"]').should("be.visible");
  });
  it("should show waiting message while waiting for api response", () => {
    cy.visit(`/top100`);
    cy.get('[data-test-id="waiting-api-response"]').should("be.visible");
  });
  it("should show a list of urls", () => {
    cy.intercept(
      {
        method: "GET",
        url: `url/mostViewed`,
        hostname: "localhost",
      },
      {
        statusCode: 200,
        body: [url, url],
      }
    );
    cy.visit("/top100");
    cy.get('[data-test-id="list-of-urls"]').should("be.visible");
    cy.get('[data-test-id="url-of-list"]').should("have.length", 2);
  });
  describe("favorites", () => {
    it("should show a favorite button when user is logged in", () => {
      cy.setLocalStorage("accessToken", accessToken);
      cy.intercept(
        {
          method: "GET",
          url: `url/mostViewed`,
          hostname: "localhost",
        },
        {
          statusCode: 200,
          body: [url, url],
        }
      );
      cy.visit("/top100");
      cy.get('[data-test-id="btn-favorite"]').should("be.visible");
    });
    it("should show a favorite button when user is logged in", () => {
      cy.setLocalStorage("accessToken", accessToken);
      cy.intercept(
        {
          method: "GET",
          url: `url/mostViewed`,
          hostname: "localhost",
        },
        {
          statusCode: 200,
          body: [url, { ...url, id: "123" }],
        }
      );
      cy.intercept(
        {
          method: "POST",
          url: `favorite`,
          hostname: "localhost",
        },
        {
          statusCode: 200,
          body: {
            id: "123456",
          },
        }
      );
      cy.visit("/top100");
      cy.get('[data-test-id="url-of-list"]').should("have.length", 2);
      cy.get('[data-test-id="btn-favorite"]').first().click({ force: true });
      cy.get('[data-test-id="url-of-list"]').should("have.length", 1);
      cy.get('[data-test-id="favorite-of-list"]').should("have.length", 1);
    });
  });
});
