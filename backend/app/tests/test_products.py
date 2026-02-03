def test_get_products(client):
    res = client.get("/products")
    assert res.status_code == 200
    assert isinstance(res.json(), list)


def test_update_product_stock_success(client):
    # Cash id = 1
    res = client.put("/products/1", json={"stock": 5})
    assert res.status_code == 200
    assert res.json()["stock"] == 5


def test_update_product_stock_negative(client):
    res = client.put("/products/1", json={"stock": -1})
    assert res.status_code == 400