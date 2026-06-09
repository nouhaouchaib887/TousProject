from sqlmodel import Session, select
from uuid import uuid4
from datetime import datetime
from app.models.core.location.location import LieuDit, Region, Province, Commune
from app.models.plugins.topography.reference_system import ReferenceSystem

def get_locations_tree(db: Session):
    regions = db.exec(
        select(Region).order_by(Region.name.asc())
    ).all()

    result = []

    for region in regions:
        provinces = db.exec(
            select(Province)
            .where(Province.region_id == region.id)
            .order_by(Province.name.asc())
        ).all()

        region_data = {
            "id": str(region.id),
            "name": region.name,
            "provinces": []
        }

        for province in provinces:
            communes = db.exec(
                select(Commune)
                .where(Commune.province_id == province.id)
                .order_by(Commune.name.asc())
            ).all()

            province_data = {
                "id": str(province.id),
                "name": province.name,
                "communes": []
            }
            for commune in communes:
                lieu_dits = db.exec(
                select(LieuDit)
                .where(LieuDit.commune_id == commune.id)
                .order_by(LieuDit.name.asc())
            ).all()

                commune_data = {
                "id": str(commune.id),
                "name": commune.name,
                "lieu_dits": [
                    {
                        "id": str(lieu_dit.id),
                        "name": lieu_dit.name
                    }
                    for lieu_dit in lieu_dits
                ]
            }

                province_data["communes"].append(commune_data)
            region_data["provinces"].append(province_data)

        result.append(region_data)
    print(result)

    return result


def get_reference_system(db:Session):
    reference_systems = db.exec(
        select(ReferenceSystem).order_by(ReferenceSystem.name.asc())
    ).all()

    return reference_systems



