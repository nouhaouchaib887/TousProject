from sqlmodel import Session, select
from uuid import uuid4
from app.models.core.projects.attachment import Attachment
from app.models.core.Finance.transaction import PaymentTransaction
import uuid
from typing import List, Optional
from datetime import datetime


def add_transactions_action_(
    db: Session,       
    finance_data_id: uuid.UUID,
    current_user_id: uuid.UUID,
    transactions: List[dict] = None
):

    saved_transactions = []
    for trans_item in transactions:
            # a. Enregistrer la transaction
            trans_info = trans_item
            new_trans = PaymentTransaction(**trans_info, financial_details_id=finance_data_id)
            new_trans.created_at = datetime.utcnow()
            new_trans.updated_by_id = current_user_id
            db.add(new_trans)

            db.flush() # Pour récupérer l'ID de la transaction
            saved_transactions.append({"id": new_trans.id})
            # b. Enregistrer les fichiers liés à cette transaction
            #trans_files = trans_item.get("files", [])
           # for f in trans_files:
                #new_file = Attachment(
                    #**f,
                   # transaction_id=new_trans.id,
               # )
                #db.add(new_file)    
    return saved_transactions     

from sqlmodel import Session, select
from datetime import datetime
import uuid
from typing import List
from app.models.core.Finance.transaction import PaymentTransaction

def generate_receipt_number(db: Session) -> str:
    year = datetime.utcnow().year

    receipts = db.exec(
        select(PaymentTransaction).where(
            PaymentTransaction.reference_number.like(f"REC-{year}-%")
        )
    ).all()

    sequence = len(receipts) + 1

    return f"REC-{year}-{sequence:04d}"
def add_transactions_action(
    db: Session,       
    finance_data_id: uuid.UUID,
    current_user_id: uuid.UUID,
    transactions: List[dict] = None
):
    transactions = transactions or []

    incoming_ids = {
        uuid.UUID(t["id"]) if isinstance(t.get("id"), str) else t.get("id")
        for t in transactions
        if t.get("id")
    }

    existing_transactions = db.exec(
        select(PaymentTransaction).where(
            PaymentTransaction.financial_details_id == finance_data_id
        )
    ).all()

    existing_ids = {t.id for t in existing_transactions}

    saved_transactions = []

    # 1. Marquer comme non confirmées celles absentes du nouveau payload
    for db_trans in existing_transactions:
        if db_trans.id not in incoming_ids:
            db_trans.is_confirmed = False
            db_trans.updated_at = datetime.utcnow()
            db_trans.updated_by_id = current_user_id
            db.add(db_trans)

    # 2. Ajouter ou mettre à jour celles envoyées
    for item in transactions:
        trans_id = item.get("id")

        if trans_id:
            trans_id = uuid.UUID(trans_id) if isinstance(trans_id, str) else trans_id
            db_trans = db.get(PaymentTransaction, trans_id)

            if not db_trans:
                continue

            for key, value in item.items():
                if key != "id" and hasattr(db_trans, key):
                    setattr(db_trans, key, value)

            db_trans.is_confirmed = True
            db_trans.updated_at = datetime.utcnow()
            db_trans.updated_by_id = current_user_id

        else:
            clean_item = {
                key: value
                for key, value in item.items()
                if hasattr(PaymentTransaction, key)
            }

            db_trans = PaymentTransaction(
                **clean_item,
                financial_details_id=finance_data_id,
            )
            db_trans.created_at = datetime.utcnow()
            db_trans.updated_at = datetime.utcnow()
            db_trans.updated_by_id = current_user_id
            db_trans.is_confirmed = True
            db_trans.reference_number = generate_receipt_number(db)

        db.add(db_trans)
        db.flush()

        saved_transactions.append({
            "id": db_trans.id,
            "reference_number": db_trans.reference_number
        })

    return saved_transactions               
