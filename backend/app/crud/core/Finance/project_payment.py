from app.crud.core.Finance.transactions import add_transactions_action
from sqlmodel import Session, select
from uuid import uuid4
from app.models.core.Finance.project_payment import FinancialDetails
import uuid
from typing import List, Optional
from datetime import datetime


def add_financial_details_action(
    db: Session,
    current_user_id: uuid.UUID,
    project_id: uuid.UUID,
    finance_data: dict   
):  
    
    transactions_data = finance_data.pop("transactions", [])
    
    # 1. UPDATE FINANCE (L'aspect comptable)
    db_finance = db.exec(select(FinancialDetails).where(FinancialDetails.project_id == project_id)).first()
    if not db_finance:
        db_finance = FinancialDetails(**finance_data, project_id=project_id)
        db_finance.created_at = datetime.utcnow()
        db_finance.updated_by_id = current_user_id
    else:
        
        for key, value in finance_data.items():
            if value is not None:
                setattr(db_finance, key, value) # Mise à jour dynamique des champs saisis
    db.add(db_finance)
    db.flush()
    # 5. AJOUT DES TRANSACTIONS (S'il y a une avance payée)
    saved_transactions = []
    if transactions_data:
       saved_transactions =  add_transactions_action(db, db_finance.id, current_user_id, transactions_data)  
    return {
        "id": db_finance.id,
        "transactions": saved_transactions
    }                 
