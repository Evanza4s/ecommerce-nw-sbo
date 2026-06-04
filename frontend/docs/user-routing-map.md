# User Routing Map

## Route Structure After Cleanup

### Public
- `/`
- `/products`
- `/products/[slug]`

### Auth
- `/login`
- `/register`
- `/verify`

### Protected Shopping
- `/cart`
- `/checkout`

### Protected Orders
- `/orders`
- `/orders/[id]`
- `/orders/[id]/verify`
- `/orders/[id]/refund`

## Pages Already Available
- Home page
- Product catalog page
- Product detail page
- Cart page
- Checkout page
- Orders list page
- Order detail page
- Verify order page
- Refund request page
- Login page
- Register page
- Verify account page

## Missing Pages That Should Be Added Next

### High Priority
- `/payment/[orderId]`
  Purpose: payment instruction, pending/paid/failed state, retry flow.
- `/profile`
  Purpose: customer profile summary and account settings.
- `/profile/addresses`
  Purpose: list saved shipping addresses.
- `/profile/addresses/create`
  Purpose: add new address.
- `/profile/addresses/[id]/edit`
  Purpose: edit saved address.

### Medium Priority
- `/wishlist`
  Purpose: saved products before checkout.
- `/notifications`
  Purpose: order, payment, shipping, refund updates.
- `/orders/[id]/review`
  Purpose: submit review after order completion.
- `/search`
  Purpose: dedicated search results page if search grows beyond catalog query state.

### Nice to Have
- `/help`
- `/faq`
- `/contact`
- `/returns-policy`
- `/shipping-policy`

## Notes
- Public product routing should use plural naming consistently: `/products/...`
- Order actions should stay nested under `/orders/[id]/...`
- Filtering and sorting should stay in query params under `/products`
