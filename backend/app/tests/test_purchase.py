def test_purchase_success(client):
    res = client.post(
        "/purchase",
        json={
            "product_id": 1,
            "inserted_money": {
                "10": 2
            }
        }
    )

    assert res.status_code == 200
    body = res.json()
    assert body["success"] is True
    assert "change" in body


def test_purchase_not_enough_money(client):
    res = client.post(
        "/purchase",
        json={
            "product_id": 1,
            "inserted_money": {
                "1": 1
            }
        }
    )

    assert res.status_code == 200
    assert res.json()["success"] is False
