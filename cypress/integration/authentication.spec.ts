describe("authentication", () => {
  it("navigate to login when click in login tap on header", () => {
    cy.visit("/");
    cy.get('[data-test-id="link-to-login"]').click();
    cy.url().should("include", "/login");
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
    it("should submit login form", () => {
      cy.visit("/login");
      cy.get('[data-test-id="email-signin"]').type("email-valid@email.com");
      cy.get('[data-test-id="password-signin"]').type("123456");
      cy.get('[data-test-id="btn-submit-signin"]').click();
      cy.get(".q-field__messages").should("be.hidden");
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
    it("should submit register form", () => {
      cy.visit("/login");
      cy.get('[data-test-id="email-signup"]').type("email-valid@email.com");
      cy.get('[data-test-id="name-signup"]').type("name valid");
      cy.get('[data-test-id="password-signup"]').type("123456");
      cy.get('[data-test-id="btn-submit-signup"]').click();
      cy.get(".q-field__messages").should("be.hidden");
    });
  });
});
