const accessToken =
  "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDY0OTA4NjksImVtYWlsIjoiZXhhbXBsZUBlbWFpbC5jb20ifQ.k_b8OIG-gPxoz_NFivATPPKdOAb6KbA76A8PjHsHPc4";
const refreshToken = "000-000-000-000";
describe("authentication", () => {
  it("navigate to login when click in login tap on header", () => {
    cy.visit("/");
    cy.get('[data-test-id="link-to-login"]').click();
    cy.url().should("include", "/login");
  });
  it("redirect to home if user authenticated", () => {
    cy.setLocalStorage("refreshToken", refreshToken);
    cy.setLocalStorage("accessToken", accessToken);
    cy.visit("/login");
    cy.get('[data-test-id="user-authenticated-email"]').should("be.visible");
    cy.url().should("not.include", "/login");
  });
  describe("Login", () => {
    it("should try make login, but the email is empty", () => {
      cy.visit("/login");
      cy.get('[data-test-id="btn-submit-signin"]').click();
      cy.get(".q-field__messages").should("be.visible");
      cy.get(".q-field__messages").contains("Email é um campo obrigatório");
    });
    it("should try make login, but the email is not valid", () => {
      cy.visit("/login");
      cy.get('[data-test-id="email-signin"]').type("email-invalid");
      cy.get('[data-test-id="btn-submit-signin"]').click();
      cy.get(".q-field__messages").should("be.visible");
      cy.get(".q-field__messages").contains("Preencha com um email valido");
    });
    it("should try make login, but the password is empty", () => {
      cy.visit("/login");
      cy.get('[data-test-id="email-signin"]').type("email-valid@email.com");
      cy.get('[data-test-id="btn-submit-signin"]').click();
      cy.get(".q-field__messages").should("be.visible");
      cy.get(".q-field__messages").contains("Senha é um campo obrigatório");
    });
    it("should try make login, but the password or email wrong", () => {
      cy.intercept(
        {
          method: "POST",
          url: "auth/signin",
          hostname: "localhost",
        },
        {
          statusCode: 400,
          body: {
            message: "Password or email invalid",
          },
        }
      );
      cy.visit("/login");
      cy.get('[data-test-id="email-signin"]').type("email-valid@email.com");
      cy.get('[data-test-id="password-signin"]').type("123456");
      cy.get('[data-test-id="btn-submit-signin"]').click();
      cy.get(".swal2-title").contains("Email ou senha incorreto(a)");
      cy.get(".q-field__messages").should("be.hidden");
    });
    it("should make login", () => {
      cy.intercept(
        {
          method: "POST",
          url: "auth/signin",
          hostname: "localhost",
        },
        {
          statusCode: 200,
          body: {
            accessToken,
            refreshToken,
          },
        }
      );
      cy.visit("/login");
      cy.get('[data-test-id="email-signin"]').type("email-valid@email.com");
      cy.get('[data-test-id="password-signin"]').type("123456");
      cy.get('[data-test-id="btn-submit-signin"]').click();
      cy.url().should("not.include", "/login");
    });
  });

  describe("Register", () => {
    it("should try make register, but the email is not valid", () => {
      cy.visit("/login");
      cy.get('[data-test-id="email-signup"]').type("email-invalid");
      cy.get('[data-test-id="btn-submit-signup"]').click();
      cy.get(".q-field__messages").should("be.visible");
      cy.get(".q-field__messages").contains("Preencha com um email valido");
    });
    it("should try make register, but the name is empty", () => {
      cy.visit("/login");
      cy.get('[data-test-id="email-signup"]').type("email-valid@email.com");
      cy.get('[data-test-id="btn-submit-signup"]').click();
      cy.get(".q-field__messages").should("be.visible");
      cy.get(".q-field__messages").contains("Nome é um campo obrigatório");
    });
    it("should try make register, but the password is empty", () => {
      cy.visit("/login");
      cy.get('[data-test-id="email-signup"]').type("email-valid@email.com");
      cy.get('[data-test-id="name-signup"]').type("name valid");
      cy.get('[data-test-id="btn-submit-signup"]').click();
      cy.get(".q-field__messages").should("be.visible");
      cy.get(".q-field__messages").contains("Senha é um campo obrigatório");
    });
    it("should try make register, but the password is very short", () => {
      cy.visit("/login");
      cy.get('[data-test-id="email-signup"]').type("email-valid@email.com");
      cy.get('[data-test-id="name-signup"]').type("name valid");
      cy.get('[data-test-id="password-signup"]').type("123");
      cy.get('[data-test-id="btn-submit-signup"]').click();
      cy.get(".q-field__messages").should("be.visible");
      cy.get(".q-field__messages").contains(
        "Use uma senha maior por questão de segurança"
      );
    });
    it("should try make register, but email already in use", () => {
      cy.intercept(
        {
          method: "POST",
          url: "auth/signup",
          hostname: "localhost",
        },
        {
          statusCode: 400,
          body: {
            message: "Email already in use",
          },
        }
      );
      cy.visit("/login");
      cy.get('[data-test-id="email-signup"]').type("email-valid@email.com");
      cy.get('[data-test-id="name-signup"]').type("name valid");
      cy.get('[data-test-id="password-signup"]').type("123456");
      cy.get('[data-test-id="btn-submit-signup"]').click();
      cy.get(".q-field__messages").should("be.hidden");
      cy.get(".swal2-title").should("be.visible");
      cy.get(".swal2-title").contains("Este email já está e uso");
    });
    it("should register in aplication", () => {
      cy.intercept(
        {
          method: "POST",
          url: "auth/signup",
          hostname: "localhost",
        },
        {
          statusCode: 200,
        }
      );
      cy.visit("/login");
      cy.get('[data-test-id="email-signup"]').type("email-valid@email.com");
      cy.get('[data-test-id="name-signup"]').type("name valid");
      cy.get('[data-test-id="password-signup"]').type("123456");
      cy.get('[data-test-id="btn-submit-signup"]').click();
      cy.get(".q-field__messages").should("be.hidden");
    });
  });
});
