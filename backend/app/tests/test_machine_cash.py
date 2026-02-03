def test_get_machine_cash(client):
    res = client.get("/machine-cash")
    assert res.status_code == 200
    assert isinstance(res.json(), list)


def test_update_machine_cash(client):
    # สมมติ cash id = 1
    res = client.put("/machine-cash/1", json={"quantity": 50})
    assert res.status_code == 200
    assert res.json()["cash"]["quantity"] == 50
    