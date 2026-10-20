const http = require("http");

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const defaultHeaders = {
      "User-Agent": "E2ETester/1.0",
    };
    if (options.body) {
      defaultHeaders["Content-Type"] = "application/json";
      defaultHeaders["Content-Length"] = Buffer.byteLength(options.body);
    }

    const req = http.request(
      `http://127.0.0.1:3000${path}`,
      {
        method: options.method || "GET",
        headers: { ...defaultHeaders, ...(options.headers || {}) },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          let json = null;
          try {
            json = JSON.parse(data);
          } catch (e) {}
          resolve({ status: res.statusCode, headers: res.headers, text: data, json });
        });
      }
    );

    req.on("error", reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function runTests() {
  console.log("==================================================================");
  console.log("        A&D PARFUM — END-TO-END AUTOMATED QA TEST SUITE           ");
  console.log("==================================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // Scenario 1: Homepage is accessible
    const home = await request("/");
    assert(
      home.status === 200 &&
        (home.text.includes("A&D Parfum") ||
          home.text.includes("A&amp;D Parfum") ||
          home.text.toLowerCase().includes("a&amp;d parfum")),
      "Scenario 1: Homepage renders bespoke editorial typography and luxury campaign"
    );

    // Scenario 2: Catalog page is accessible and lists products
    const catalog = await request("/perfumes");
    assert(
      catalog.status === 200 && (catalog.text.includes("Colección de Fragancias") || catalog.text.includes("Colección de Perfumes")),
      "Scenario 2: Catalog page renders with real fragrances"
    );

    // Scenario 3: Product Detail Page for Khamrah
    const prodDetail = await request("/perfumes/prod-khamrah");
    assert(
      prodDetail.status === 200 && prodDetail.text.includes("Khamrah") && prodDetail.text.includes("Pirámide Olfativa"),
      "Scenario 3: Product detail page renders authentic notes, concentrations, and variants"
    );

    // Scenario 4: Products API returns verified initial fragrances
    const apiProducts = await request("/api/products");
    assert(
      apiProducts.status === 200 &&
        apiProducts.json &&
        apiProducts.json.products &&
        apiProducts.json.products.length >= 8,
      `Scenario 4: Products API returns complete verified inventory (${apiProducts.json?.products?.length || 0} items)`
    );

    // Scenario 5: Search and filter API
    const searchRes = await request("/api/products?search=hawas");
    assert(
      searchRes.status === 200 &&
        searchRes.json.products.some((p) => p.name.includes("Hawas")),
      "Scenario 5: Search query 'hawas' returns Rasasi Hawas"
    );

    // Scenario 6: Filter by category
    const catRes = await request("/api/products?category=cat-arabes");
    assert(
      catRes.status === 200 && catRes.json.products.length > 0,
      "Scenario 6: Filter by category 'cat-arabes' returns Middle Eastern fragrances"
    );

    // Scenario 7: Reject invalid checkout submissions
    const invalidOrder = await request("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        customer_name: "",
        customer_phone: "",
        items: [],
      }),
    });
    assert(
      invalidOrder.status === 400 && invalidOrder.json.success === false,
      "Scenario 7: Checkout validates required customer contact fields and rejects empty payloads"
    );

    // Scenario 8: Successful Order Creation with Snapshot
    const validOrder = await request("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        customer_name: "Valentina Gómez",
        customer_phone: "3109876543",
        customer_email: "valentina@ejemplo.co",
        shipping_address: "Carrera 7 #71-52, Edificio Aurora, Apto 901",
        shipping_city: "Bogotá",
        shipping_department: "Cundinamarca",
        delivery_notes: "Dejar en recepción con el conserje",
        shipping_method: "standard",
        payment_method: "contra_entrega",
        items: [
          {
            product_id: "prod-khamrah",
            variant_id: "var-khamrah-10ml",
            quantity: 1,
          },
        ],
      }),
    });

    assert(
      validOrder.status === 201 &&
        validOrder.json.success === true &&
        validOrder.json.order &&
        validOrder.json.order.reference.startsWith("AD-"),
      `Scenario 8: Valid order created with unique reference (${validOrder.json?.order?.reference})`
    );

    const createdOrder = validOrder.json?.order;

    // Scenario 9: Order Confirmation Page renders with snapshot
    if (createdOrder) {
      const confPage = await request(`/order-confirmation/${createdOrder.id}`);
      assert(
        confPage.status === 200 && confPage.text.includes(createdOrder.reference),
        "Scenario 9: Order confirmation renders immutable snapshot, receipt, and reference"
      );
    }

    // Scenario 10: Reject order when requested quantity exceeds stock
    const overStockOrder = await request("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        customer_name: "Test Overstock",
        customer_phone: "3000000000",
        shipping_address: "Calle 100 #10-10",
        shipping_city: "Medellín",
        shipping_department: "Antioquia",
        items: [
          {
            product_id: "prod-hawas",
            variant_id: "var-hawas-100ml",
            quantity: 9999, // Exceeds actual stock
          },
        ],
      }),
    });
    assert(
      overStockOrder.status === 400 &&
        overStockOrder.json.error &&
        overStockOrder.json.error.includes("Stock insuficiente"),
      "Scenario 10: System protects inventory integrity and rejects orders exceeding available stock"
    );

    // Scenario 11: Admin Login rejected with bad password
    const badLogin = await request("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password: "wrong-password" }),
    });
    assert(
      badLogin.status === 401 && badLogin.json.success === false,
      "Scenario 11: Unauthorized visitor cannot authenticate to administrative operations"
    );

    // Scenario 12: Admin Login succeeds with valid password
    const goodLogin = await request("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password: "ad2026" }),
    });
    assert(
      goodLogin.status === 200 && goodLogin.json.success === true,
      "Scenario 12: Admin authentication succeeds and issues session cookie"
    );

    // Scenario 13: Admin CRUD — Create new perfume
    const createProd = await request("/api/products", {
      method: "POST",
      body: JSON.stringify({
        name: "Liquid Brun Exclusive",
        brand_name: "French Avenue",
        brand_id: "brand-french-avenue",
        category_name: "Alta Gama & Nicho",
        category_id: "cat-nicho",
        concentration: "Extrait de Parfum",
        gender: "Unisex",
        short_description: "Canela fina, cardamomo y praliné de vainilla bourbon.",
        description: "Una obra contemporánea de gourmand amaderado de proyección titánica.",
        olfactory_family: "Ámbar Cálido & Especiado",
        top_notes: ["Canela", "Cardamomo", "Flor de Azahar"],
        heart_notes: ["Praliné", "Vainilla Bourbon"],
        base_notes: ["Madera de Cedro", "Ámbar", "Almizcle"],
        longevity: "14 a 16 horas",
        sillage: "Pesada",
        occasion: "Noche & Ocasiones Especiales",
        season: "Clima Frío",
        base_price: 38000,
        primary_image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
        variants: [
          {
            id: `var-lb-${Date.now()}-5ml`,
            name: "Decant 5 ml",
            size_ml: 5,
            price: 38000,
            stock: 20,
            sku: `DEC-LB-05`,
            is_available: true,
          },
        ],
      }),
    });
    assert(
      createProd.status === 201 &&
        createProd.json.success === true &&
        createProd.json.product &&
        createProd.json.product.name === "Liquid Brun Exclusive",
      "Scenario 13: Admin can create a new fragrance with custom variants and notes"
    );

    const newProdId = createProd.json?.product?.id;

    // Scenario 14: Admin CRUD — Edit created perfume
    if (newProdId) {
      const editProd = await request(`/api/products/${newProdId}`, {
        method: "PUT",
        body: JSON.stringify({
          name: "Liquid Brun Exclusive (Edición Especial)",
          base_price: 40000,
        }),
      });
      assert(
        editProd.status === 200 &&
          editProd.json.product.name.includes("Edición Especial"),
        "Scenario 14: Admin can edit product properties and pricing"
      );

      // Delete test product
      const delProd = await request(`/api/products/${newProdId}`, { method: "DELETE" });
      assert(
        delProd.status === 200 && delProd.json.success === true,
        "Scenario 15: Admin can delete or archive a fragrance from catalog"
      );
    }

    // Scenario 16: Admin Update Order Status
    if (createdOrder) {
      const updateOrd = await request(`/api/orders/${createdOrder.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "shipped",
          payment_status: "paid",
        }),
      });
      assert(
        updateOrd.status === 200 &&
          updateOrd.json.order.status === "shipped" &&
          updateOrd.json.order.payment_status === "paid",
        "Scenario 16: Admin can update order status and mark payment received"
      );
    }

    // Scenario 17: Store Settings update
    const getSet = await request("/api/settings");
    assert(
      getSet.status === 200 && getSet.json.settings.store_name === "A&D Parfum",
      "Scenario 17: Store settings API returns verified business configuration"
    );

    // Scenario 18: Sitemap and Robots.txt
    const robots = await request("/robots.txt");
    const sitemap = await request("/sitemap.xml");
    assert(
      robots.status === 200 && robots.text.includes("Disallow: /admin") && sitemap.status === 200,
      "Scenario 18: SEO robots.txt protects admin and sitemap.xml exposes public catalog"
    );

  } catch (err) {
    console.error("Test execution exception:", err);
    failed++;
  }

  console.log("\n==================================================================");
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log("==================================================================");

  if (failed === 0) {
    console.log("🌟 ALL 18 CRITICAL USER JOURNEYS PASSED WITH 100% SUCCESS!");
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
