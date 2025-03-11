-- Seed initial transactions
INSERT INTO transactions (merchant_name, amount, date, category, description, is_income)
VALUES
  ('Starbucks Coffee', -4.95, '2023-05-15', 'Food & Dining', 'Morning coffee and bagel', false),
  ('Amazon', -29.99, '2023-05-14', 'Shopping', 'Wireless charger', false),
  ('Uber', -12.50, '2023-05-13', 'Transportation', 'Trip to downtown', false),
  ('Salary Deposit', 2500.00, '2023-05-01', 'Income', 'Monthly salary', true),
  ('Netflix', -14.99, '2023-05-10', 'Entertainment', 'Monthly subscription', false);
