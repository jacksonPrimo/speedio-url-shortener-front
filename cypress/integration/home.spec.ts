describe("Home", () => {
  const accessToken =
    "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDY0OTA4NjksImVtYWlsIjoiZXhhbXBsZUBlbWFpbC5jb20ifQ.k_b8OIG-gPxoz_NFivATPPKdOAb6KbA76A8PjHsHPc4";
  const refreshToken = "000-000-000-000";
  const urlBeforeSignin = {
    id: "000-000-000-000",
    originalUrl: "http://example.com",
    userId: null,
    views: 0,
  };
  const urlAfterSignin = {
    id: "000-000-000-000",
    originalUrl: "http://example.com",
    userId: "000-000-000-000",
    views: 0,
  };
  describe("navigation", () => {
    it("should navigate to home and get card title", () => {
      cy.visit("/");
      cy.get('[data-test-id="main-card"]').should("be.visible");
      cy.get('[data-test-id="main-card"]').should(
        "contain.text",
        "Gere sua url simplificada agora:"
      );
    });
  });
  describe("register url", () => {
    it("should try create a url but input is empty", () => {
      cy.visit("/");
      cy.get("input").type("{enter}");
      cy.get(".q-field__messages").should("be.visible");
      cy.get(".q-field__messages").contains("Cole aqui seu link");
    });
    it("should try create a url but input is invalid", () => {
      cy.visit("/");
      cy.get("input").type("invalid_link");
      cy.get("input").type("{enter}");
      cy.get(".q-field__messages").should("be.visible");
      cy.get(".q-field__messages").contains("Use um link válido");
    });
    it("should create a link before signin", () => {
      cy.intercept(
        {
          method: "POST",
          url: "url",
          hostname: "localhost",
        },
        {
          statusCode: 200,
          body: urlBeforeSignin,
        }
      );
      cy.visit("/");
      cy.get("input").type("http://valid_link.com");
      cy.get("input").type("{enter}");
      cy.get(".q-field__messages").should("not.be.visible");
      cy.get(".q-item").should("be.visible");
      cy.get("[data-test-id='link-generated-url']").should("be.visible");
      cy.get("[data-test-id='link-generated-url']").should(
        "include.text",
        urlBeforeSignin.id
      );
      cy.get("[data-test-id='link-original-url']").should("be.visible");
      cy.get("[data-test-id='link-original-url']").should(
        "include.text",
        urlBeforeSignin.originalUrl
      );
    });
    it("should create a link after signin", () => {
      cy.intercept(
        {
          method: "POST",
          url: "url",
          hostname: "localhost",
        },
        {
          statusCode: 200,
          body: urlAfterSignin,
        }
      );
      cy.visit("/");
      cy.get("input").type("http://valid_link.com");
      cy.get("input").type("{enter}");
      cy.get(".q-field__messages").should("not.be.visible");
      cy.get(".q-item").should("be.visible");
      cy.get("[data-test-id='delete-btn']").should("be.visible");
    });
  });
  describe("retrieve urls", () => {
    it("should retrieve urls createds from localstorage", () => {
      cy.setLocalStorage(
        "urls",
        JSON.stringify([urlBeforeSignin, urlBeforeSignin])
      );
      cy.visit("/");
      cy.get(".q-item").should("have.length", 2);
    });
    it("should retrieve urls createds from user authenticated", () => {
      cy.setLocalStorage("refreshToken", refreshToken);
      cy.setLocalStorage("accessToken", accessToken);
      cy.intercept(
        {
          method: "GET",
          url: "url",
          hostname: "localhost",
        },
        {
          statusCode: 200,
          body: [urlAfterSignin, urlAfterSignin],
        }
      );
      cy.visit("/");
      cy.get(".q-item").should("have.length", 2);
    });
  });
  describe("url actions", () => {
    it("should delete a link created after signin", () => {
      cy.intercept(
        {
          method: "POST",
          url: "url",
          hostname: "localhost",
        },
        {
          statusCode: 200,
          body: urlAfterSignin,
        }
      );
      cy.intercept(
        {
          method: "DELETE",
          url: `url/${urlAfterSignin.id}`,
          hostname: "localhost",
        },
        {
          statusCode: 200,
          body: urlAfterSignin,
        }
      );
      cy.visit("/");
      cy.get("input").type("http://valid_link.com");
      cy.get("input").type("{enter}");
      cy.get("[data-test-id='delete-btn']").click({ force: true });
      cy.get(".swal2-confirm").click();
      cy.get(".q-item").should("not.exist");
    });
    it("should copy link generated when click button", () => {
      cy.setLocalStorage("urls", JSON.stringify([urlBeforeSignin]));
      cy.visit("/");
      cy.get("[data-test-id='copy-btn']").click({ force: true });
      cy.get(".q-menu").should("be.visible");
      cy.get(".q-menu").should("contain.text", "Link copiado");
    });
  });
});
