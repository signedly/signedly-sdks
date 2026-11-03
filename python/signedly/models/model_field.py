# coding: utf-8

"""
    Signedly API

     The Signedly REST API lets your system upload documents, add signatories and fields, send them for signing and download the signed result. Every path starts with `/ap1/`, and every request and response body is JSON unless an endpoint says otherwise (the uploads are `multipart/form-data`).  ## Authentication  1. In the Signedly web app, open **Account & Settings → API** and generate a    **client ID** and **client secret** for your organisation. 2. `POST /ap1/token/` with them. You get an `access_token` (valid **2 hours**) and    a `refresh_token` (valid **7 days**). While both are still valid, calling    `/ap1/token/` again returns the same pair. 3. Send the access token on every other call:    `Authorization: Bearer <access_token>`. 4. When the access token expires, `POST /ap1/refreshtoken/` with the refresh token    for a new access token. When the refresh token has expired too, call    `/ap1/token/` again.  `/ap1/token/` and `/ap1/refreshtoken/` allow 60 calls a minute per IP address; more answer 429. A missing, unknown or expired access token answers 403 (`\"Client not found\"` or `\"Access token expired\"`).  The API acts for your **organisation's admin account**: documents you upload belong to it and appear in its Signedly web app, and you can reach only that account's documents, templates, signatories and fields. Another organisation's IDs answer 404, as if they didn't exist.  ## Plans  What the API allows depends on the Signedly plan of your **organisation's admin account** (Account & Settings → Account & Plan). The same rules apply to live and test keys.  | What | Free | Personal Pro | Business Pro | Teams | |---|---|---|---|---| | Generate live and test keys (Account & Settings → API) | – | ✓ | ✓ | ✓ | | Every endpoint, `/ap1/token/` and `/ap1/refreshtoken/` included | – | ✓ | ✓ | ✓ | | `require_email_otp` on `POST /ap1/signatories/` and `POST /ap1/signatories/bulk/` | – | ✓ | ✓ | ✓ | | Bulk send: `GET /ap1/bulk-sends/columns/` and `POST /ap1/bulk-sends/` | – | – | – | ✓ |  The API is part of the paid plans. On Free (or with no plan) every call answers 403 `\"... Your plan doesn't include API access.\"`, with live or test keys, also with a token or keys made earlier; they work again once the plan is paid. On a paid plan, a feature it doesn't include answers 400 with `\"Your plan doesn't include ...\"` and changes nothing, and `GET /ap1/bulk-sends/{id}/` still reports bulk sends already made.  Live documents also need an API contract with Signedly. Without one, or with an unpaid API invoice, `POST /ap1/upload/` (except templates), `/ap1/upload_app/`, `/ap1/documents/fromtemplate/` and `/ap1/bulk-sends/` answer 402 with live keys. Test keys work without a contract (see Sandbox).  ## Sending a document for signing  1. `POST /ap1/upload/` a PDF or DOCX (`type` 2). The document is prepared in the    background: find it in `GET /ap1/documents/?name=<name>` (its `upload.id` is    the upload's `id`), and wait until `GET /ap1/documents/{id}/pages/` lists its    pages. 2. `POST /ap1/signatories/` (one) or `POST /ap1/signatories/bulk/` (several) to    add the people who sign. 3. `POST /ap1/documents/fields/` to place the fields each signatory fills in. 4. Send it:    - `POST /ap1/document/send/` emails every signatory a signing link (with      ordered signing, only the first; each next one is emailed in      turn), or    - `POST /ap1/document/send_url/` sends no email and returns the first      signatory's signing link, for you to show or send yourself. 5. Poll `GET /ap1/documents-status-list/` (or `GET /ap1/documents/`) until the    status is 6 (Completed), then `GET /ap1/document/download-link/` for the    signed PDF and `GET /ap1/document/download-audit-link/` for its audit trail.  **From a template:** upload with `type` 4 and a `template_name` (or make the template in the web app), place its fields with `POST /ap1/templates/fields/`, then for each signing make a document with `POST /ap1/documents/fromtemplate/`, add its signatory, and send it.  **One signer, one call:** `POST /ap1/upload_app/` uploads a PDF or DOCX for one signer and returns their signing link in `redirect_url`; the signer places their own signature. After signing they go to the `redirect_url` you sent, and the signed PDF and its audit trail are emailed to `final_email` (otherwise to your organisation's admin).  ## Quick start with curl  Each step uses an ID from the step before. `$API` is this server, e.g. `https://l0ads.signedly.com`.  ```bash # 1. Token curl -X POST $API/ap1/token/ -H 'Content-Type: application/json' \\   -d '{\"client_id\": \"<client id>\", \"client_secret\": \"<client secret>\"}' TOKEN=<access_token from the answer>  # 2. Upload a PDF (answers with the upload's id) curl -X POST $API/ap1/upload/ -H \"Authorization: Bearer $TOKEN\" \\   -F file=@nda.pdf -F name=nda-ann-lee -F type=2  # 3. Find the document, then wait until it has pages curl \"$API/ap1/documents/?name=nda-ann-lee\" -H \"Authorization: Bearer $TOKEN\" DOC=<results[0].id> curl $API/ap1/documents/$DOC/pages/ -H \"Authorization: Bearer $TOKEN\" PAGE=<[0].id>  # 4. Add the signatory curl -X POST $API/ap1/signatories/ -H \"Authorization: Bearer $TOKEN\" \\   -H 'Content-Type: application/json' \\   -d '{\"document_id\": \"'$DOC'\", \"name\": \"Ann Lee\", \"email\": \"ann@example.com\"}' SIGNER=<id from the answer>  # 5. Place her signature: 150 × 40 points, 72 points from the left, 640 from the top curl -X POST $API/ap1/documents/fields/ -H \"Authorization: Bearer $TOKEN\" \\   -H 'Content-Type: application/json' \\   -d '[{\"document_id\": \"'$DOC'\", \"signatory_id\": \"'$SIGNER'\", \"kind\": 2,         \"label\": \"Signature\", \"placeholder\": \"Sign here\", \"page\": \"'$PAGE'\",         \"page_number\": 0, \"x\": 72, \"y\": 640, \"width\": 150, \"height\": 40}]'  # 6. Send it (Ann gets the signing email) curl -X POST $API/ap1/document/send/ -H \"Authorization: Bearer $TOKEN\" \\   -H 'Content-Type: application/json' \\   -d '{\"document_id\": \"'$DOC'\", \"subject\": \"Please sign the NDA\",        \"message\": \"Hi Ann, please sign by Friday.\", \"expiry_date\": \"2026-12-31\"}'  # 7. Poll until status is 6 (Completed), then get the signed PDF curl \"$API/ap1/documents-status-list/?document_ids=$DOC\" -H \"Authorization: Bearer $TOKEN\" curl \"$API/ap1/document/download-link/?id=$DOC\" -H \"Authorization: Bearer $TOKEN\" ```  ## Postman  Import the whole API into Postman with **Import → Link** and `<this server>/swaggerap1/postman.json`. Set `client_id` and `client_secret` in the collection's **Variables**, run **Get an access token** (it saves the token for every other request), and set `document_id` when a request needs one.  ## Webhooks  Instead of polling, add an endpoint with `POST /ap1/webhooks/` (or in **Account & Settings → API**) and Signedly posts your organisation's document events to it: `document.sent`, `document.viewed`, `document.signed`, `document.approved`, `document.completed`, `document.rejected` and `document.expired` (all of them, or the `events` you choose). Each is a JSON `POST`:  ```json {\"id\": \"5b7f…\", \"type\": \"document.signed\", \"created_at\": \"2026-10-27T09:12:00+00:00\",  \"test\": false,  \"data\": {\"document\": {\"id\": \"6f0c…\", \"name\": \"nda.pdf\", \"status\": 5},           \"recipient\": {\"id\": \"0b6e…\", \"email\": \"ann@example.com\", \"name\": \"Ann Lee\",                         \"role\": \"signer\"}}} ```  `recipient` is null for events no recipient caused (sent, completed, expired); `test` is true for documents made with your test keys. Fetch anything else, such as download links, with your access token: events never carry links.  **Check every event is from Signedly.** The `Signedly-Signature` header is `t=<unix seconds>,v1=<signature>`, where the signature is the hex HMAC-SHA256 of `<t>.<raw body>` with the endpoint's secret. Refuse an event whose signature doesn't match or whose `t` is more than 5 minutes off:  ```python import hashlib, hmac, time  def is_from_signedly(secret, header, raw_body):     parts = dict(item.split(\"=\", 1) for item in header.split(\",\"))     signed = f\"{parts['t']}.{raw_body.decode()}\".encode()     expected = hmac.new(secret.encode(), signed, hashlib.sha256).hexdigest()     fresh = abs(time.time() - int(parts[\"t\"])) <= 300     return fresh and hmac.compare_digest(parts[\"v1\"], expected) ```  **Answer 2xx within 10 seconds**, then do the work. Anything else is retried after 1 and 5 minutes, then 30 minutes and 2, 5 and 10 hours (7 tries in about 18 hours). `Signedly-Event-Id` is the same on every try of an event: use it to ignore repeats. After 20 events in a row fail for good, Signedly switches the endpoint off and emails your organisation's admin; switch it on again with `PUT /ap1/webhooks/{id}/` and `\"is_active\": true`. Each endpoint's deliveries and their last answers are at `GET /ap1/webhooks/{id}/deliveries/`, and any can be sent again.  ## Sandbox  Build and test against the API without paying for documents: in **Account & Settings → API**, generate your **test keys**, and get a token with them at `/ap1/token/` as usual. Everything works the same, except that what you upload or make from a template with a test token is a **test document** (`is_test` on its upload):  - every page of its PDF and of its audit trail says **TEST – NOT LEGALLY BINDING**; - its emails are real, with `[TEST]` at the start of the subject; - it isn't billed or counted toward your plan; - your organisation can make 50 a calendar month (templates don't count); the next   upload answers 429.  ## Fields  Positions and sizes are in **PDF points** (1/72 inch), measured from the **top-left corner** of the page as it is displayed (rotation applied). `page_number` counts pages from 0. A field must sit wholly on its page (1 point of tolerance); otherwise it is refused with 400. A field's page and signatory can't be changed later: delete the field and add it again.  ## Status values  **Document `status`:** 1 Draft · 2 Signees Added · 3 Prepared · 4 Sent · 5 In Progress · 6 Completed · 7 Rejected · 8 Archived · 9 Expired. Signatories, fields and sends are only accepted while a document is 1–3 (not yet sent).  **Signatory `status`:** 1 Waiting · 2 Invited · 3 Signed · 4 Viewed · 5 Rejected.  ## Lists  `GET /ap1/documents/`, `/ap1/documents-status-list/`, `/ap1/templates/`, `/ap1/logs/` and `/ap1/logs/hits/` are paged: pass `limit` (default 10) and `offset`, and read `count`, `next`, `previous` and `results` from the response.  ## Errors  | Status | Meaning | |---|---| | 400 | The request was refused, also when your plan doesn't include it (see Plans); the body says why (`{\"error\": \"...\"}`, or the name of each bad field with its messages). Nothing was changed. | | 403 | The access token is missing, unknown or expired; the client ID and secret or the refresh token were refused; the organisation's plan has no API access (Free, see Plans); or an `expiry_date` isn't in the future (`\"Invalid Date Entered\"`). | | 402 | No API contract, or an unpaid API invoice: live documents are refused (test keys keep working). | | 404 | The document, template, signatory or field doesn't exist or isn't yours. | | 429 | Too many token requests (wait a minute), or this month's 50 test documents are used. | | 5xx | Our side failed; retry later. |  A send that times out may still have worked: check the document's status before sending again (a second send of a sent document answers 400).  Download, view and audit links are valid for about 7 days; ask for a new one whenever you need it. 

    The version of the OpenAPI document: v1
    Contact: support@signedly.com
    Generated by OpenAPI Generator (https://openapi-generator.tech)

    Do not edit the class manually.
"""  # noqa: E501


from __future__ import annotations
import pprint
import re  # noqa: F401
import json

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, StrictBool, StrictFloat, StrictInt, StrictStr
from typing import Any, ClassVar, Dict, List, Optional, Union
from typing_extensions import Annotated
from typing import Optional, Set
from typing_extensions import Self

class ModelField(BaseModel):
    """
    ModelField
    """ # noqa: E501
    align: Optional[StrictInt] = Field(default=None, description="Text: 0 Left · 1 Center · 2 Right.")
    checked: Optional[StrictBool] = Field(default=False, description="Checkbox: ticked or not.")
    created_at: Optional[datetime] = Field(default=None, description="When the field was added.")
    date_format: Optional[StrictInt] = Field(default=None, description="Date: 1 dd_mm_yyyy · 2 mm_dd_yyyy · 3 dd mmm yyyy · 4 dd-mm-yyyy.")
    font: Optional[Annotated[str, Field(min_length=1, strict=True)]] = Field(default='Roboto', description="Text, Date and Dropdown: the font.")
    font_size: Optional[StrictInt] = Field(default=None, description="Text and Dropdown: the font size in points (Date: 10).")
    formula: Optional[StrictStr] = Field(default=None, description="A calculated field's formula, or null.")
    group_name: Optional[Annotated[str, Field(strict=True, max_length=100)]] = Field(default=None, description="Radio: the option group's name.")
    height: Optional[StrictInt] = Field(default=None, description="In PDF points (1/72 inch): the field's height.")
    id: Optional[StrictStr] = Field(default=None, description="The field's ID.")
    is_multi_line: Optional[StrictBool] = Field(default=None, description="Text: the signer may type several lines.")
    is_required: Optional[StrictBool] = Field(default=None, description="False: the signer may leave it empty.")
    items: Optional[List[Dict[str, Any]]] = Field(default=None, description="Radio: the options, each `{x, y, selected}`.")
    kind: Optional[StrictInt] = Field(default=None, description="The field's type: 1 Text · 2 Signature · 3 Date · 5 Checkbox · 6 Radio · 9 Dropdown · 10 Sign Stamp.")
    label: Optional[Annotated[str, Field(strict=True, max_length=100)]] = Field(default=None, description="The field's name, shown to the signer.")
    max_length: Optional[Annotated[int, Field(le=550, strict=True, ge=1)]] = Field(default=None, description="Text: the most characters the signer may type.")
    number_format: Optional[Dict[str, Any]] = Field(default=None, description="How a calculated number is shown, or null.")
    page: Optional[StrictStr] = Field(default=None, description="The ID of the page the field is on.")
    page_number: Optional[StrictInt] = Field(default=None, description="That page's number, counting from 0.")
    placeholder: Optional[Annotated[str, Field(strict=True, max_length=550)]] = Field(default=None, description="Hint text shown while the field is empty.")
    select_options: Optional[List[Annotated[str, Field(strict=True, max_length=100)]]] = Field(default=None, description="Dropdown: the choices the signer picks from.")
    signatory_id: Optional[StrictStr] = Field(default=None, description="The ID of the signatory who fills it in.")
    size: Optional[StrictInt] = Field(default=None, description="Checkbox and Radio: the side of the tick or dot in points.")
    tool_tip: Optional[Annotated[str, Field(strict=True, max_length=100)]] = Field(default=None, description="Shown when the signer points at the field.")
    updated_at: Optional[datetime] = Field(default=None, description="When the field last changed.")
    value: Optional[StrictStr] = Field(default=None, description="The field's current value.")
    width: Optional[Union[StrictFloat, StrictInt]] = Field(default=None, description="In PDF points (1/72 inch): the field's width.")
    x: Optional[Union[StrictFloat, StrictInt]] = Field(default=None, description="In PDF points (1/72 inch): from the page's left edge to the field's left edge.")
    y: Optional[Union[StrictFloat, StrictInt]] = Field(default=None, description="In PDF points (1/72 inch): from the page's top edge to the field's top edge.")
    __properties: ClassVar[List[str]] = ["align", "checked", "created_at", "date_format", "font", "font_size", "formula", "group_name", "height", "id", "is_multi_line", "is_required", "items", "kind", "label", "max_length", "number_format", "page", "page_number", "placeholder", "select_options", "signatory_id", "size", "tool_tip", "updated_at", "value", "width", "x", "y"]

    model_config = ConfigDict(
        populate_by_name=True,
        validate_assignment=True,
        protected_namespaces=(),
    )


    def to_str(self) -> str:
        """Returns the string representation of the model using alias"""
        return pprint.pformat(self.model_dump(by_alias=True))

    def to_json(self) -> str:
        """Returns the JSON representation of the model using alias"""
        # TODO: pydantic v2: use .model_dump_json(by_alias=True, exclude_unset=True) instead
        return json.dumps(self.to_dict())

    @classmethod
    def from_json(cls, json_str: str) -> Optional[Self]:
        """Create an instance of ModelField from a JSON string"""
        return cls.from_dict(json.loads(json_str))

    def to_dict(self) -> Dict[str, Any]:
        """Return the dictionary representation of the model using alias.

        This has the following differences from calling pydantic's
        `self.model_dump(by_alias=True)`:

        * `None` is only added to the output dict for nullable fields that
          were set at model initialization. Other fields with value `None`
          are ignored.
        * OpenAPI `readOnly` fields are excluded.
        * OpenAPI `readOnly` fields are excluded.
        * OpenAPI `readOnly` fields are excluded.
        """
        excluded_fields: Set[str] = set([
            "created_at",
            "id",
            "updated_at",
        ])

        _dict = self.model_dump(
            by_alias=True,
            exclude=excluded_fields,
            exclude_none=True,
        )
        # set to None if formula (nullable) is None
        # and model_fields_set contains the field
        if self.formula is None and "formula" in self.model_fields_set:
            _dict['formula'] = None

        # set to None if group_name (nullable) is None
        # and model_fields_set contains the field
        if self.group_name is None and "group_name" in self.model_fields_set:
            _dict['group_name'] = None

        # set to None if label (nullable) is None
        # and model_fields_set contains the field
        if self.label is None and "label" in self.model_fields_set:
            _dict['label'] = None

        # set to None if max_length (nullable) is None
        # and model_fields_set contains the field
        if self.max_length is None and "max_length" in self.model_fields_set:
            _dict['max_length'] = None

        # set to None if number_format (nullable) is None
        # and model_fields_set contains the field
        if self.number_format is None and "number_format" in self.model_fields_set:
            _dict['number_format'] = None

        # set to None if placeholder (nullable) is None
        # and model_fields_set contains the field
        if self.placeholder is None and "placeholder" in self.model_fields_set:
            _dict['placeholder'] = None

        # set to None if tool_tip (nullable) is None
        # and model_fields_set contains the field
        if self.tool_tip is None and "tool_tip" in self.model_fields_set:
            _dict['tool_tip'] = None

        # set to None if value (nullable) is None
        # and model_fields_set contains the field
        if self.value is None and "value" in self.model_fields_set:
            _dict['value'] = None

        # set to None if x (nullable) is None
        # and model_fields_set contains the field
        if self.x is None and "x" in self.model_fields_set:
            _dict['x'] = None

        # set to None if y (nullable) is None
        # and model_fields_set contains the field
        if self.y is None and "y" in self.model_fields_set:
            _dict['y'] = None

        return _dict

    @classmethod
    def from_dict(cls, obj: Optional[Dict[str, Any]]) -> Optional[Self]:
        """Create an instance of ModelField from a dict"""
        if obj is None:
            return None

        if not isinstance(obj, dict):
            return cls.model_validate(obj)

        _obj = cls.model_validate({
            "align": obj.get("align"),
            "checked": obj.get("checked") if obj.get("checked") is not None else False,
            "created_at": obj.get("created_at"),
            "date_format": obj.get("date_format"),
            "font": obj.get("font") if obj.get("font") is not None else 'Roboto',
            "font_size": obj.get("font_size"),
            "formula": obj.get("formula"),
            "group_name": obj.get("group_name"),
            "height": obj.get("height"),
            "id": obj.get("id"),
            "is_multi_line": obj.get("is_multi_line"),
            "is_required": obj.get("is_required"),
            "items": obj.get("items"),
            "kind": obj.get("kind"),
            "label": obj.get("label"),
            "max_length": obj.get("max_length"),
            "number_format": obj.get("number_format"),
            "page": obj.get("page"),
            "page_number": obj.get("page_number"),
            "placeholder": obj.get("placeholder"),
            "select_options": obj.get("select_options"),
            "signatory_id": obj.get("signatory_id"),
            "size": obj.get("size"),
            "tool_tip": obj.get("tool_tip"),
            "updated_at": obj.get("updated_at"),
            "value": obj.get("value"),
            "width": obj.get("width"),
            "x": obj.get("x"),
            "y": obj.get("y")
        })
        return _obj


